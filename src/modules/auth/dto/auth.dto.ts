import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export enum UserRole {
  USER = "USER",
  VENDOR = "VENDOR",
  ADMIN = "ADMIN",
}

export class RegisterDto {
  @ApiProperty({ example: "jane@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "SecurePass123!" })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: "Jane" })
  @IsString()
  firstName: string;

  @ApiProperty({ example: "Doe" })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.USER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class LoginDto {
  @ApiProperty({ example: "jane@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "SecurePass123!" })
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: "jane@example.com" })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty({ example: "NewSecurePass123!" })
  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
  expiresIn: number;
}

export class SessionDto {
  @ApiProperty({ enum: UserRole })
  role: UserRole;
}
