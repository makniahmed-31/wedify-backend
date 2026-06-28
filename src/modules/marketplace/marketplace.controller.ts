import { Controller, Get, Query, Param } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { MarketplaceService } from "./marketplace.service";
import { RankingQueryDto } from "./dto/marketplace.dto";
import { Public } from "../../common/decorators/public.decorator";

@ApiTags("marketplace")
@Controller("marketplace")
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Public()
  @Get("homepage")
  @ApiOperation({
    summary:
      "Get homepage data: featured, top-rated, new vendors and categories",
  })
  getHomepage() {
    return this.marketplaceService.getHomepageData();
  }

  @Public()
  @Get("rankings")
  @ApiOperation({
    summary: "Get vendor rankings with subscription-boosted scoring",
  })
  getRankings(@Query() query: RankingQueryDto) {
    return this.marketplaceService.getRankings(query);
  }

  @Public()
  @Get("category/:category")
  @ApiOperation({ summary: "Get vendors by category (browsing page)" })
  getCategoryPage(
    @Param("category") category: string,
    @Query("city") city?: string,
  ) {
    return this.marketplaceService.getCategoryPage(category, city);
  }

  @Public()
  @Get("featured")
  @ApiOperation({ summary: "Get featured (PREMIUM) vendors" })
  getFeatured(@Query("limit") limit = 8) {
    return this.marketplaceService.getFeaturedVendors(limit);
  }

  @Public()
  @Get("cities")
  @ApiOperation({ summary: "Get popular cities by vendor count" })
  getCities(@Query("limit") limit = 12) {
    return this.marketplaceService.getCitiesWithMostVendors(limit);
  }
}
