import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  Req,
  Res,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { AuthGuard } from "@nestjs/passport";
import { Response, Request } from "express";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AuthResponseDto,
  SessionDto,
} from "./dto/auth.dto";
import { Public } from "../../common/decorators/public.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { User } from "@prisma/client";

const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000;
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  private get isProd(): boolean {
    return this.config.get<string>("NODE_ENV") === "production";
  }

  private setAuthCookies(res: Response, tokens: AuthResponseDto): void {
    const base = {
      httpOnly: true,
      sameSite: "strict" as const,
      secure: this.isProd,
    };
    res.cookie("wedify_token", tokens.accessToken, {
      ...base,
      maxAge: ACCESS_TOKEN_TTL_MS,
      path: "/",
    });
    res.cookie("wedify_refresh", tokens.refreshToken, {
      ...base,
      maxAge: REFRESH_TOKEN_TTL_MS,
      path: "/api/v1/auth/refresh",
    });
  }

  private clearAuthCookies(res: Response): void {
    res.clearCookie("wedify_token", { path: "/" });
    res.clearCookie("wedify_refresh", { path: "/api/v1/auth/refresh" });
  }

  @Public()
  @Post("register")
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @ApiOperation({ summary: "Register a new user" })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SessionDto> {
    const tokens = await this.authService.register(dto);
    this.setAuthCookies(res, tokens);
    return { role: tokens.role };
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @ApiOperation({
    summary: "Login and receive JWT tokens via httpOnly cookies",
  })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SessionDto> {
    const tokens = await this.authService.login(dto);
    this.setAuthCookies(res, tokens);
    return { role: tokens.role };
  }

  @Public()
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @ApiOperation({
    summary: "Refresh access token using httpOnly refresh cookie",
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SessionDto> {
    const refreshToken = req.cookies["wedify_refresh"] as string | undefined;
    if (!refreshToken) throw new BadRequestException("No refresh token");
    const tokens = await this.authService.refresh({ refreshToken });
    this.setAuthCookies(res, tokens);
    return { role: tokens.role };
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Logout, revoke refresh token, and clear cookies" })
  async logout(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.logout(user.id);
    this.clearAuthCookies(res);
  }

  @Public()
  @Get("verify-email")
  @ApiOperation({ summary: "Verify email with token" })
  verifyEmail(@Query("token") token: string) {
    return this.authService.verifyEmail(token);
  }

  @Public()
  @Post("forgot-password")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @ApiOperation({ summary: "Request password reset email" })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Public()
  @Post("reset-password")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Reset password using token" })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @Public()
  @Get("google")
  @UseGuards(AuthGuard("google"))
  @ApiOperation({ summary: "Initiate Google OAuth flow" })
  googleAuth() {}

  @Public()
  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  @ApiOperation({ summary: "Google OAuth callback" })
  async googleCallback(@Req() req: any, @Res() res: Response) {
    const tokens = await this.authService.handleGoogleUser(req.user);
    const code = this.authService.generateExchangeCode(tokens);
    const frontendUrl = this.config.get<string>(
      "NEXT_PUBLIC_APP_URL",
      "http://localhost:3000",
    );
    res.redirect(`${frontendUrl}/auth/callback?code=${code}`);
  }

  @Public()
  @Post("exchange")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @ApiOperation({ summary: "Exchange one-time OAuth code for session cookies" })
  async exchange(
    @Body("code") code: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SessionDto> {
    if (!code) throw new BadRequestException("code is required");
    const tokens = this.authService.exchangeCode(code);
    this.setAuthCookies(res, tokens);
    return { role: tokens.role };
  }
}
