import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { ReviewsService } from "./reviews.service";
import { CreateReviewDto, ModerationDto } from "./dto/review.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";

@ApiTags("reviews")
@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Public()
  @Get("vendor/:vendorId")
  @ApiOperation({ summary: "Get approved reviews for a vendor (public)" })
  findByVendor(
    @Param("vendorId") vendorId: string,
    @Query("page") page = 1,
    @Query("limit") limit = 10,
  ) {
    return this.reviewsService.findByVendor(vendorId, page, limit);
  }

  @Public()
  @Get("latest")
  @ApiOperation({ summary: "Get latest approved reviews (public)" })
  findLatest(@Query("limit") limit = 6) {
    return this.reviewsService.findLatest(limit);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: "[Couple] Submit a review for a completed booking" })
  create(@CurrentUser() user: any, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("VENDOR")
  @Put(":id/reply")
  @ApiOperation({ summary: "[Vendor] Post a public reply to a review" })
  vendorReply(
    @CurrentUser() user: any,
    @Param("id") id: string,
    @Body("reply") reply: string,
  ) {
    return this.reviewsService.vendorReply(user.id, id, reply);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get("pending")
  @ApiOperation({ summary: "[Admin] List reviews pending moderation" })
  findPending(@Query("page") page = 1, @Query("limit") limit = 20) {
    return this.reviewsService.findPending(page, limit);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Put(":id/moderate")
  @ApiOperation({ summary: "[Admin] Approve or reject a review" })
  moderate(@Param("id") id: string, @Body() dto: ModerationDto) {
    return this.reviewsService.moderate(id, dto);
  }
}
