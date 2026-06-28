import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { AnalyticsService } from "./analytics.service";
import { AnalyticsQueryDto } from "./dto/analytics.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@ApiTags("analytics")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(RolesGuard)
  @Roles("VENDOR")
  @Get("vendor")
  @ApiOperation({ summary: "[Vendor] Get my analytics dashboard data" })
  getMyAnalytics(@CurrentUser() user: any, @Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getVendorAnalytics(user.id, query);
  }

  @UseGuards(RolesGuard)
  @Roles("VENDOR")
  @Get("vendor/revenue")
  @ApiOperation({ summary: "[Vendor] Get my revenue report" })
  getRevenue(@CurrentUser() user: any, @Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getRevenueReport(user.id, query);
  }

  @UseGuards(RolesGuard)
  @Roles("ADMIN")
  @Get("platform")
  @ApiOperation({ summary: "[Admin] Get platform-wide stats" })
  getPlatformStats(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getPlatformStats(query);
  }

  @UseGuards(RolesGuard)
  @Roles("ADMIN")
  @Get("top-vendors")
  @ApiOperation({ summary: "[Admin] Get top-performing vendors" })
  getTopVendors(
    @Query("category") category?: string,
    @Query("limit") limit = 10,
  ) {
    return this.analyticsService.getTopVendors(category, limit);
  }
}
