import { Injectable } from "@nestjs/common";
import { SeoScoreDto, UpdateSeoMetaDto } from "./dto/seo.dto";

@Injectable()
export class SeoService {
  async calculateScore(_vendorId: string): Promise<SeoScoreDto> {
    // TODO: Fetch vendor data, compute weighted score across dimensions:
    //   - Profile completeness (business name, description, city, website, tags)
    //   - Media count (photos/videos uploaded)
    //   - Review count and average rating
    //   - Booking response rate
    //   - Description word count
    //   - Website linked
    throw new Error("Not implemented");
  }

  async getScore(_vendorId: string): Promise<SeoScoreDto> {
    // TODO: Return cached score or recalculate
    throw new Error("Not implemented");
  }

  async updateMeta(_vendorId: string, _dto: UpdateSeoMetaDto): Promise<void> {
    // TODO: Update meta title, description, and slug for the vendor profile page
  }

  async recalculateAll(): Promise<void> {
    // TODO: Batch job to recalculate SEO scores for all vendors (cron-triggered)
  }

  async getSitemapData(): Promise<{ slug: string; updatedAt: Date }[]> {
    // TODO: Return all active vendor slugs for sitemap generation
    throw new Error("Not implemented");
  }
}
