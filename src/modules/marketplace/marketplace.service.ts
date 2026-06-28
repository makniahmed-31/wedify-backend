import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Vendor } from "@prisma/client";

@Injectable()
export class MarketplaceService {
  constructor(private readonly prisma: PrismaService) {}

  async getHomepageData() {
    const [featured, newest, categoryStats, cityStats] = await Promise.all([
      this.getFeaturedVendors(8),
      this.prisma.vendor.findMany({
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      this.getCategoryStats(),
      this.getCitiesWithMostVendors(12),
    ]);

    const totalVendors = await this.prisma.vendor.count({
      where: { status: "ACTIVE" },
    });

    return {
      featured,
      newest: newest.map(this.toPublic),
      categoryStats,
      cityStats,
      totalVendors,
    };
  }

  async getRankings(query: {
    category?: string;
    city?: string;
    page?: number;
    limit?: number;
  }) {
    const where: any = { status: "ACTIVE" };
    if (query.category) where.categorySlug = query.category;
    if (query.city) where.citySlug = query.city;

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;

    const [vendors, total] = await Promise.all([
      this.prisma.vendor.findMany({
        where,
        orderBy: { rankScore: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.vendor.count({ where }),
    ]);
    return { data: vendors.map(this.toPublic), total, page, limit };
  }

  async getCategoryPage(category: string, city?: string) {
    const where: any = { status: "ACTIVE", categorySlug: category };
    if (city) where.citySlug = city;

    const vendors = await this.prisma.vendor.findMany({
      where,
      orderBy: { rankScore: "desc" },
    });
    return { data: vendors.map(this.toPublic), total: vendors.length };
  }

  async getFeaturedVendors(limit = 8) {
    const vendors = await this.prisma.vendor.findMany({
      where: {
        status: "ACTIVE",
        OR: [{ isFeatured: true }, { plan: "PREMIUM" }],
      },
      orderBy: { rankScore: "desc" },
      take: limit,
    });
    return vendors.map(this.toPublic);
  }

  async getCitiesWithMostVendors(limit = 12) {
    const groups = await this.prisma.vendor.groupBy({
      by: ["city", "citySlug"],
      where: { status: "ACTIVE", city: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: limit,
    });

    return groups.map((g) => ({
      name: g.city,
      slug: g.citySlug,
      vendorCount: g._count.id,
    }));
  }

  private async getCategoryStats() {
    const groups = await this.prisma.vendor.groupBy({
      by: ["category", "categorySlug"],
      where: { status: "ACTIVE", category: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    return groups.map((g) => ({
      name: g.category,
      slug: g.categorySlug,
      vendorCount: g._count.id,
    }));
  }

  private toPublic(v: Vendor) {
    return {
      id: v.id,
      slug: v.slug,
      businessName: v.businessName,
      tagline: v.tagline,
      category: v.category,
      categorySlug: v.categorySlug,
      city: v.city,
      citySlug: v.citySlug,
      coverImage: v.coverImage,
      plan: v.plan,
      rating: v.averageRating,
      reviewCount: v.reviewCount,
      isVerified: v.isVerified,
      isFeatured: v.isFeatured,
      rankScore: v.rankScore,
      minPrice: v.minPrice ? Number(v.minPrice) : 0,
      maxPrice: v.maxPrice ? Number(v.maxPrice) : 0,
    };
  }
}
