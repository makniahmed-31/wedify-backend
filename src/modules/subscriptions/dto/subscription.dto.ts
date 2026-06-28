import { IsString, IsEnum, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export enum SubscriptionPlan {
  FREE = "FREE",
  STARTER = "STARTER",
  PROFESSIONAL = "PROFESSIONAL",
  PREMIUM = "PREMIUM",
}

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  TRIALING = "TRIALING",
  PAST_DUE = "PAST_DUE",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

export class CreateSubscriptionDto {
  @ApiProperty({ enum: SubscriptionPlan })
  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;

  @ApiPropertyOptional({ description: "Stripe payment method ID" })
  @IsOptional()
  @IsString()
  paymentMethodId?: string;
}

export class SubscriptionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  vendorId: string;

  @ApiProperty({ enum: SubscriptionPlan })
  plan: SubscriptionPlan;

  @ApiProperty({ enum: SubscriptionStatus })
  status: SubscriptionStatus;

  @ApiPropertyOptional()
  currentPeriodStart?: Date;

  @ApiPropertyOptional()
  currentPeriodEnd?: Date;

  @ApiPropertyOptional()
  stripeSubscriptionId?: string;

  @ApiProperty()
  createdAt: Date;
}

export class PlanFeaturesDto {
  @ApiProperty({ enum: SubscriptionPlan })
  plan: SubscriptionPlan;

  @ApiProperty()
  priceMonthly: number;

  @ApiProperty()
  priceAnnual: number;

  @ApiProperty()
  maxServices: number;

  @ApiProperty()
  maxPhotos: number;

  @ApiProperty()
  featuredInSearch: boolean;

  @ApiProperty()
  analyticsAccess: boolean;

  @ApiProperty()
  prioritySupport: boolean;
}
