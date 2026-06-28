import { IsDateString, IsOptional, IsEnum } from "class-validator";
import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";

export enum AnalyticsPeriod {
  LAST_7_DAYS = "LAST_7_DAYS",
  LAST_30_DAYS = "LAST_30_DAYS",
  LAST_90_DAYS = "LAST_90_DAYS",
  LAST_YEAR = "LAST_YEAR",
  CUSTOM = "CUSTOM",
}

export class AnalyticsQueryDto {
  @ApiPropertyOptional({
    enum: AnalyticsPeriod,
    default: AnalyticsPeriod.LAST_30_DAYS,
  })
  @IsOptional()
  @IsEnum(AnalyticsPeriod)
  period?: AnalyticsPeriod;

  @ApiPropertyOptional({ description: "Required if period is CUSTOM" })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: "Required if period is CUSTOM" })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class VendorAnalyticsDto {
  @ApiProperty()
  vendorId: string;

  @ApiProperty()
  period: { start: Date; end: Date };

  @ApiProperty()
  profileViews: number;

  @ApiProperty()
  profileViewsTrend: number;

  @ApiProperty()
  inquiries: number;

  @ApiProperty()
  bookingRequests: number;

  @ApiProperty()
  confirmedBookings: number;

  @ApiProperty()
  conversionRate: number;

  @ApiProperty()
  totalRevenue: number;

  @ApiProperty()
  averageRating: number;

  @ApiProperty()
  searchImpressions: number;

  @ApiProperty()
  searchClickThroughRate: number;

  @ApiProperty()
  topSourcePages: { page: string; visits: number }[];
}
