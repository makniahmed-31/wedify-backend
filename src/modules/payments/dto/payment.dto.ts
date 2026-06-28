import { IsString, IsNumber, IsOptional, IsEnum, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export enum PaymentType {
  BOOKING_DEPOSIT = "BOOKING_DEPOSIT",
  BOOKING_FINAL = "BOOKING_FINAL",
  SUBSCRIPTION = "SUBSCRIPTION",
  REFUND = "REFUND",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
}

export class CreatePaymentIntentDto {
  @ApiProperty()
  @IsString()
  bookingId: string;

  @ApiProperty({ enum: PaymentType })
  @IsEnum(PaymentType)
  type: PaymentType;

  @ApiPropertyOptional({
    description: "Amount in cents. Derived from booking if omitted.",
  })
  @IsOptional()
  @IsNumber()
  @Min(50)
  amountCents?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currency?: string;
}

export class RefundDto {
  @ApiPropertyOptional({
    description: "Amount in cents. Full refund if omitted.",
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  amountCents?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}

export class PaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  bookingId: string;

  @ApiProperty({ enum: PaymentType })
  type: PaymentType;

  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

  @ApiProperty()
  amountCents: number;

  @ApiProperty()
  currency: string;

  @ApiPropertyOptional({
    description: "Stripe PaymentIntent client secret (frontend use)",
  })
  clientSecret?: string;

  @ApiPropertyOptional()
  stripePaymentIntentId?: string;

  @ApiProperty()
  createdAt: Date;
}
