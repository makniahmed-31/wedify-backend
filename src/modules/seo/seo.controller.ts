import { Controller, Get, Put, Body, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { SeoService } from "./seo.service";
import { UpdateSeoMetaDto } from "./dto/seo.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";

@ApiTags("seo")
@Controller("seo")
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("VENDOR")
  @Get("score")
  @ApiOperation({
    summary: "[Vendor] Get my SEO score and improvement recommendations",
  })
  getMyScore(@CurrentUser() user: any) {
    return this.seoService.getScore(user.vendorId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("VENDOR")
  @Put("meta")
  @ApiOperation({
    summary: "[Vendor] Update SEO meta title, description, and slug",
  })
  updateMeta(@CurrentUser() user: any, @Body() dto: UpdateSeoMetaDto) {
    return this.seoService.updateMeta(user.vendorId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get("score/:vendorId")
  @ApiOperation({ summary: "[Admin] Get SEO score for any vendor" })
  getVendorScore(@Param("vendorId") vendorId: string) {
    return this.seoService.calculateScore(vendorId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Put("recalculate")
  @ApiOperation({
    summary: "[Admin] Trigger batch SEO score recalculation for all vendors",
  })
  recalculateAll() {
    return this.seoService.recalculateAll();
  }

  @Public()
  @Get("sitemap")
  @ApiOperation({ summary: "Get vendor slugs for sitemap generation" })
  getSitemap() {
    return this.seoService.getSitemapData();
  }
}
