import { Controller, Get, Query, Param } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { SearchService } from "./search.service";
import { SearchQueryDto } from "./dto/search.dto";
import { Public } from "../../common/decorators/public.decorator";

@ApiTags("search")
@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Full-text vendor search with filters and sorting" })
  search(@Query() query: SearchQueryDto) {
    return this.searchService.search(query);
  }

  @Public()
  @Get("autocomplete")
  @ApiOperation({ summary: "Autocomplete suggestions for search input" })
  autocomplete(@Query("q") term: string) {
    return this.searchService.autocomplete(term);
  }

  @Public()
  @Get("popular")
  @ApiOperation({ summary: "Get trending search terms" })
  popular() {
    return this.searchService.getPopularSearches();
  }

  @Public()
  @Get("similar/:vendorId")
  @ApiOperation({ summary: "Get similar vendors (same category/region)" })
  similar(@Param("vendorId") vendorId: string, @Query("limit") limit = 6) {
    return this.searchService.getSimilarVendors(vendorId, limit);
  }
}
