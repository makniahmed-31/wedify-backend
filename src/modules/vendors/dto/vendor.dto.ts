import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsNumber,
  Min,
  IsUrl,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export enum VendorCategory {
  VENUE = "VENUE",
  PHOTOGRAPHER = "PHOTOGRAPHER",
  VIDEOGRAPHER = "VIDEOGRAPHER",
  CATERER = "CATERER",
  FLORIST = "FLORIST",
  DJ = "DJ",
  BAND = "BAND",
  PLANNER = "PLANNER",
  CAKE = "CAKE",
  HAIR_MAKEUP = "HAIR_MAKEUP",
  TRANSPORTATION = "TRANSPORTATION",
  OFFICIANT = "OFFICIANT",
}

export enum VendorStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
}

export class CreateVendorProfileDto {
  @ApiProperty()
  @IsString()
  businessName: string;

  @ApiProperty({ enum: VendorCategory })
  @IsEnum(VendorCategory)
  category: VendorCategory;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  startingPrice?: number;
}

export class UpdateVendorProfileDto {
  @ApiPropertyOptional() @IsOptional() @IsString() businessName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() tagline?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() city?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() website?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() whatsapp?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() facebook?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() instagram?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() youtube?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() tiktok?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() videoUrl?: string;
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery?: string[];
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) minPrice?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) maxPrice?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  yearsInBusiness?: number;
}

export class VendorResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  businessName: string;

  @ApiProperty({ enum: VendorCategory })
  category: VendorCategory;

  @ApiProperty({ enum: VendorStatus })
  status: VendorStatus;

  @ApiPropertyOptional()
  averageRating?: number;

  @ApiPropertyOptional()
  reviewCount?: number;

  @ApiPropertyOptional()
  seoScore?: number;

  @ApiProperty()
  createdAt: Date;
}
