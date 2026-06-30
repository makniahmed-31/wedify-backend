import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  AuthResponseDto,
  UserRole,
} from "./dto/auth.dto";
import { UsersService } from "../users/users.service";
import { MailerService } from "../../common/mailer/mailer.service";
import { User } from "@prisma/client";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
    private readonly mailer: MailerService,
  ) {}

  generateExchangeCode(tokens: AuthResponseDto): string {
    return this.jwtService.sign(
      { at: tokens.accessToken, rt: tokens.refreshToken },
      { expiresIn: "60s" },
    );
  }

  exchangeCode(code: string): AuthResponseDto {
    let payload: { at: string; rt: string };
    try {
      payload = this.jwtService.verify(code) as { at: string; rt: string };
    } catch {
      throw new UnauthorizedException("Invalid or expired exchange code");
    }
    if (!payload.at || !payload.rt) {
      throw new UnauthorizedException("Invalid exchange code");
    }
    return {
      accessToken: payload.at,
      refreshToken: payload.rt,
      expiresIn: 900,
    };
  }

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException("Email already registered");

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.usersService.create({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      passwordHash,
      role: dto.role ?? UserRole.USER,
      isEmailVerified: false,
    });

    await this.sendVerificationEmail(user);

    return this.issueAndStoreTokens(user);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user?.passwordHash)
      throw new UnauthorizedException("Invalid credentials");

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException("Invalid credentials");

    return this.issueAndStoreTokens(user);
  }

  async refresh(dto: RefreshTokenDto): Promise<AuthResponseDto> {
    let payload: any;
    try {
      payload = this.jwtService.verify(dto.refreshToken, {
        secret: this.config.get<string>(
          "JWT_REFRESH_SECRET",
          "wedify-refresh-secret",
        ),
      });
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const user = await this.usersService.findOne(payload.sub);
    if (!user.refreshToken)
      throw new UnauthorizedException("Refresh token revoked");

    const match = await bcrypt.compare(dto.refreshToken, user.refreshToken);
    if (!match) throw new UnauthorizedException("Invalid refresh token");

    return this.issueAndStoreTokens(user);
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.update(userId, { refreshToken: null });
  }

  async handleGoogleUser(profile: {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
  }): Promise<AuthResponseDto> {
    let user = await this.usersService.findByGoogleId(profile.googleId);

    if (!user) {
      user = await this.usersService.findByEmail(profile.email);
      if (user) {
        user = await this.usersService.update(user.id, {
          googleId: profile.googleId,
        });
      } else {
        user = await this.usersService.create({
          ...profile,
          role: UserRole.USER,
          isEmailVerified: true,
        });
      }
    }

    return this.issueAndStoreTokens(user);
  }

  async verifyEmail(token: string): Promise<void> {
    let payload: { sub: string; type: string };
    try {
      payload = this.jwtService.verify(token) as {
        sub: string;
        type: string;
      };
    } catch {
      throw new BadRequestException("Invalid or expired verification token");
    }

    if (payload.type !== "email-verification") {
      throw new BadRequestException("Invalid token type");
    }

    const user = await this.usersService.findOne(payload.sub);
    if (user.isEmailVerified) return;

    await this.usersService.update(user.id, { isEmailVerified: true });
  }

  async forgotPassword(_email: string): Promise<void> {
    // TODO: implement forgot password
  }

  async resetPassword(_token: string, _newPassword: string): Promise<void> {
    // TODO: implement reset password
  }

  private async sendVerificationEmail(user: User): Promise<void> {
    const token = this.jwtService.sign(
      { sub: user.id, type: "email-verification" },
      { expiresIn: "24h" },
    );
    const appUrl = this.config.get<string>(
      "NEXT_PUBLIC_APP_URL",
      "http://localhost:3000",
    );
    const link = `${appUrl}/auth/verify-email?token=${token}`;

    this.logger.log(`Verification link for ${user.email}: ${link}`);

    await this.mailer.sendMail(
      user.email,
      "Vérifiez votre adresse e-mail — Wedify",
      `<p>Bonjour ${user.firstName},</p>
<p>Cliquez sur le lien ci-dessous pour vérifier votre adresse e-mail. Ce lien expire dans 24 heures.</p>
<p><a href="${link}">${link}</a></p>
<p>Si vous n'avez pas créé de compte, ignorez cet e-mail.</p>`,
    );
  }

  private async issueAndStoreTokens(user: User): Promise<AuthResponseDto> {
    const tokens = this.issueTokens(user);
    const hashed = await bcrypt.hash(tokens.refreshToken, 10);
    await this.usersService.update(user.id, { refreshToken: hashed });
    return tokens;
  }

  private issueTokens(user: User): AuthResponseDto {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: "15m" });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>(
        "JWT_REFRESH_SECRET",
        "wedify-refresh-secret",
      ),
      expiresIn: "7d",
    });
    return { accessToken, refreshToken, expiresIn: 900 };
  }
}
