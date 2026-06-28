import { IsString, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SeoScoreDto {
  @ApiProperty()
  vendorId: string;

  @ApiProperty({ description: "Overall SEO score 0-100" })
  score: number;

  @ApiProperty()
  breakdown: {
    profileCompleteness: number; // 0-30 pts
    photoCount: number; // 0-20 pts
    reviewCount: number; // 0-20 pts
    responseRate: number; // 0-15 pts
    descriptionLength: number; // 0-10 pts
    websiteLinked: number; // 0-5 pts
  };

  @ApiProperty({ type: [String] })
  recommendations: string[];

  @ApiProperty()
  calculatedAt: Date;
}

export class UpdateSeoMetaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string;
}
