import {
  IsString,
  IsDateString,
  IsOptional,
  IsNumber,
  IsEnum,
  Min,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export class CreateBookingDto {
  @ApiProperty()
  @IsString()
  vendorId: string;

  @ApiProperty()
  @IsString()
  serviceId: string;

  @ApiProperty({ example: "2025-09-15" })
  @IsDateString()
  weddingDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  guestCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateBookingDto {
  @ApiPropertyOptional({ enum: BookingStatus })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class BookingResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  coupleId: string;

  @ApiProperty()
  vendorId: string;

  @ApiProperty()
  serviceId: string;

  @ApiProperty({ enum: BookingStatus })
  status: BookingStatus;

  @ApiProperty()
  weddingDate: Date;

  @ApiPropertyOptional()
  totalAmount?: number;

  @ApiPropertyOptional()
  depositAmount?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
