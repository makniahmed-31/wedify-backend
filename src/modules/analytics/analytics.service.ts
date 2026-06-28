import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AnalyticsQueryDto } from "./dto/analytics.dto";

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getVendorAnalytics(userId: string, query: AnalyticsQueryDto) {
    const vendor = await this.prisma.vendor.findFirst({ where: { userId } });
    if (!vendor) return null;

    return {
      vendorId: vendor.id,
      period: query.period ?? "LAST_30_DAYS",
      profileViews: 0,
      profileViewsTrend: 0,
      inquiries: 0,
      bookingRequests: 0,
      confirmedBookings: 0,
      conversionRate: 0,
      totalRevenue: 0,
      averageRating: vendor.averageRating,
      reviewCount: vendor.reviewCount,
      searchImpressions: 0,
      searchClickThroughRate: 0,
    };
  }

  async trackEvent(_event: {
    type: string;
    vendorId?: string;
    userId?: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    // Events tracking not yet implemented - requires analytics_events table
  }

  async getPlatformStats(_query: AnalyticsQueryDto) {
    const [totalVendors, pendingVendors, cityGroups] = await Promise.all([
      this.prisma.vendor.count({ where: { status: "ACTIVE" } }),
      this.prisma.vendor.count({ where: { status: "PENDING" } }),
      this.prisma.vendor.groupBy({
        by: ["citySlug"],
        where: { status: "ACTIVE" },
      }),
    ]);

    return {
      totalVendors,
      pendingVendors,
      totalCities: cityGroups.length,
      totalBookings: 0,
      totalUsers: 0,
    };
  }

  async getRevenueReport(vendorId: string, _query: AnalyticsQueryDto) {
    return { vendorId, revenue: [], total: 0 };
  }

  async getTopVendors(category?: string, limit = 10) {
    const vendors = await this.prisma.vendor.findMany({
      where: {
        status: "ACTIVE",
        ...(category ? { categorySlug: category } : {}),
      },
      orderBy: { rankScore: "desc" },
      take: limit,
    });
    return vendors.map((v) => ({
      id: v.id,
      businessName: v.businessName,
      slug: v.slug,
      category: v.category,
      city: v.city,
      rankScore: v.rankScore,
      averageRating: v.averageRating,
      reviewCount: v.reviewCount,
    }));
  }
}
