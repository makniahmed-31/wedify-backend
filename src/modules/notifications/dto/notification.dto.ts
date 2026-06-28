import { IsString, IsOptional, IsEnum, IsArray } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export enum NotificationChannel {
  EMAIL = "EMAIL",
  SMS = "SMS",
  IN_APP = "IN_APP",
  PUSH = "PUSH",
}

export enum NotificationType {
  BOOKING_REQUEST = "BOOKING_REQUEST",
  BOOKING_CONFIRMED = "BOOKING_CONFIRMED",
  BOOKING_CANCELLED = "BOOKING_CANCELLED",
  BOOKING_COMPLETED = "BOOKING_COMPLETED",
  REVIEW_RECEIVED = "REVIEW_RECEIVED",
  REVIEW_APPROVED = "REVIEW_APPROVED",
  PAYMENT_RECEIVED = "PAYMENT_RECEIVED",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  SUBSCRIPTION_EXPIRING = "SUBSCRIPTION_EXPIRING",
  VENDOR_APPROVED = "VENDOR_APPROVED",
  VENDOR_SUSPENDED = "VENDOR_SUSPENDED",
  MESSAGE_RECEIVED = "MESSAGE_RECEIVED",
}

export class SendNotificationDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty({ enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiPropertyOptional({ type: [String], enum: NotificationChannel })
  @IsOptional()
  @IsArray()
  channels?: NotificationChannel[];

  @ApiPropertyOptional()
  @IsOptional()
  payload?: Record<string, any>;
}

export class NotificationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: NotificationType })
  type: NotificationType;

  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  isRead: boolean;

  @ApiProperty()
  createdAt: Date;
}
