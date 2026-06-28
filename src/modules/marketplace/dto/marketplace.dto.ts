import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsEnum } from "class-validator";
import { VendorCategory } from "../../vendors/dto/vendor.dto";

export class HomepageDto {
  @ApiProperty({ description: "Featured vendors (PREMIUM subscribers)" })
  featuredVendors: any[];

  @ApiProperty({ description: "Top-rated vendors across all categories" })
  topRatedVendors: any[];

  @ApiProperty({ description: "Newly joined vendors" })
  newlyJoined: any[];

  @ApiProperty({ description: "Category browse cards" })
  categories: {
    category: VendorCategory;
    count: number;
    coverImage?: string;
  }[];

  @ApiProperty({ description: "Popular wedding destinations/cities" })
  popularCities: { city: string; vendorCount: number }[];
}

export class RankingQueryDto {
  @ApiPropertyOptional({ enum: VendorCategory })
  @IsOptional()
  @IsEnum(VendorCategory)
  category?: VendorCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  limit?: number;
}

export class VendorRankingDto {
  @ApiProperty()
  rank: number;

  @ApiProperty()
  vendorId: string;

  @ApiProperty()
  businessName: string;

  @ApiProperty()
  rankingScore: number;

  @ApiProperty()
  tier: string;
}
