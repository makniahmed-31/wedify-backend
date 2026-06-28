import { IsString, IsOptional, IsEnum, IsDateString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { VendorStatus } from "../../vendors/dto/vendor.dto";

export class AdminVendorActionDto {
  @ApiProperty({ enum: VendorStatus })
  @IsEnum(VendorStatus)
  status: VendorStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}

export class AdminStatsDto {
  @ApiProperty()
  totalUsers: number;

  @ApiProperty()
  totalVendors: number;

  @ApiProperty()
  activeVendors: number;

  @ApiProperty()
  pendingVendors: number;

  @ApiProperty()
  totalBookings: number;

  @ApiProperty()
  totalRevenue: number;

  @ApiProperty()
  monthlyRecurringRevenue: number;

  @ApiProperty()
  averageSeoScore: number;

  @ApiProperty()
  pendingReviews: number;
}

export class AdminQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  plan?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  limit?: number;
}
