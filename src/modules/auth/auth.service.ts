import {
  Injectable,
  UnauthorizedException,
  ConflictException,
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
import { User } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  generateExchangeCode(tokens: AuthResponseDto): string {
    return this.jwtService.sign(
      { at: tokens.accessToken, rt: tokens.refreshToken, role: tokens.role },
      { expiresIn: "60s" },
    );
  }

  exchangeCode(code: string): AuthResponseDto {
    let payload: { at: string; rt: string; role: UserRole };
    try {
      payload = this.jwtService.verify(code) as {
        at: string;
        rt: string;
        role: UserRole;
      };
    } catch {
      throw new UnauthorizedException("Invalid or expired exchange code");
    }
    if (!payload.at || !payload.rt) {
      throw new UnauthorizedException("Invalid exchange code");
    }
    return {
      accessToken: payload.at,
      refreshToken: payload.rt,
      role: payload.role,
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
    let payload: { sub: string; email: string; role: string };
    try {
      payload = this.jwtService.verify(dto.refreshToken, {
        secret: this.config.getOrThrow<string>("JWT_REFRESH_SECRET"),
      }) as { sub: string; email: string; role: string };
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

  async verifyEmail(_token: string): Promise<void> {}

  async forgotPassword(_email: string): Promise<void> {}

  async resetPassword(_token: string, _newPassword: string): Promise<void> {}

  private async issueAndStoreTokens(user: User): Promise<AuthResponseDto> {
    const tokens = this.issueTokens(user);
    const hashed = await bcrypt.hash(tokens.refreshToken, 10);
    await this.usersService.update(user.id, { refreshToken: hashed });
    return tokens;
  }

  private issueTokens(user: User): AuthResponseDto {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const jwtExpiresIn = this.config.get<string>("JWT_EXPIRES_IN", "15m");
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: jwtExpiresIn,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow<string>("JWT_REFRESH_SECRET"),
      expiresIn: "7d",
    });
    return {
      accessToken,
      refreshToken,
      role: user.role as UserRole,
      expiresIn: 900,
    };
  }
}
