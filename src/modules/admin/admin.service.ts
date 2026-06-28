import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  AdminVendorActionDto,
  AdminStatsDto,
  AdminQueryDto,
} from "./dto/admin.dto";

const PLAN_REVENUE: Record<string, number> = {
  BASIC: 29,
  PRO: 79,
  PREMIUM: 149,
};

const SEED_VENDORS = [
  {
    businessName: "Elegance Hall Tunis",
    slug: "elegance-hall-tunis",
    tagline: "La salle de mariage N°1 à Tunis",
    category: "Salles de mariage",
    categorySlug: "wedding-halls",
    city: "Tunis",
    citySlug: "tunis",
    plan: "PREMIUM",
    status: "ACTIVE",
    coverImage:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80",
    isVerified: true,
    isFeatured: true,
    rankScore: 98,
    minPrice: 5000,
    maxPrice: 25000,
    averageRating: 4.9,
    reviewCount: 128,
    responseTime: "Sous 1h",
    yearsInBusiness: 12,
  },
  {
    businessName: "Photo Elite Studio",
    slug: "photo-elite-studio",
    tagline: "Capturer chaque moment précieux",
    category: "Photographes",
    categorySlug: "photographers",
    city: "Tunis",
    citySlug: "tunis",
    plan: "PRO",
    status: "PENDING",
    coverImage:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80",
    isVerified: false,
    isFeatured: false,
    rankScore: 60,
    minPrice: 1200,
    maxPrice: 6000,
    averageRating: 4.5,
    reviewCount: 42,
    responseTime: "Sous 2h",
    yearsInBusiness: 4,
  },
  {
    businessName: "Cake Paradise",
    slug: "cake-paradise-sfax",
    tagline: "L'art pâtissier au service de votre mariage",
    category: "Gâteaux",
    categorySlug: "sweets",
    city: "Sfax",
    citySlug: "sfax",
    plan: "PRO",
    status: "ACTIVE",
    coverImage:
      "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=1200&q=80",
    isVerified: true,
    isFeatured: false,
    rankScore: 74,
    minPrice: 300,
    maxPrice: 2000,
    averageRating: 4.7,
    reviewCount: 86,
    responseTime: "Sous 3h",
    yearsInBusiness: 7,
  },
  {
    businessName: "DJ Maestro",
    slug: "dj-maestro-nabeul",
    tagline: "La meilleure ambiance pour votre soirée",
    category: "DJs",
    categorySlug: "djs",
    city: "Nabeul",
    citySlug: "nabeul",
    plan: "BASIC",
    status: "ACTIVE",
    coverImage:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80",
    isVerified: true,
    isFeatured: false,
    rankScore: 52,
    minPrice: 400,
    maxPrice: 1500,
    averageRating: 4.6,
    reviewCount: 54,
    responseTime: "Sous 4h",
    yearsInBusiness: 5,
  },
  {
    businessName: "Décor Rêve",
    slug: "decor-reve-sousse",
    tagline: "Transformez votre rêve en réalité",
    category: "Décorateurs",
    categorySlug: "decorators",
    city: "Sousse",
    citySlug: "sousse",
    plan: "PRO",
    status: "PENDING",
    coverImage:
      "https://images.unsplash.com/photo-1470920045568-f40e14622c7a?w=1200&q=80",
    isVerified: false,
    isFeatured: false,
    rankScore: 55,
    minPrice: 800,
    maxPrice: 5000,
    averageRating: 4.3,
    reviewCount: 28,
    responseTime: "Sous 6h",
    yearsInBusiness: 3,
  },
  {
    businessName: "Le Jardin Royal",
    slug: "le-jardin-royal-sousse",
    tagline: "Un cadre exceptionnel pour un jour unique",
    category: "Salles de mariage",
    categorySlug: "wedding-halls",
    city: "Sousse",
    citySlug: "sousse",
    plan: "PREMIUM",
    status: "ACTIVE",
    coverImage:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80",
    isVerified: true,
    isFeatured: true,
    rankScore: 91,
    minPrice: 4000,
    maxPrice: 20000,
    averageRating: 4.8,
    reviewCount: 112,
    responseTime: "Sous 2h",
    yearsInBusiness: 9,
  },
  {
    businessName: "Orchestre Carthage",
    slug: "orchestre-carthage-bizerte",
    tagline: "La musique qui fait danser tous vos invités",
    category: "Groupes musicaux",
    categorySlug: "music-bands",
    city: "Bizerte",
    citySlug: "bizerte",
    plan: "PRO",
    status: "ACTIVE",
    coverImage:
      "https://images.unsplash.com/photo-1501386761578-eaa54b756476?w=1200&q=80",
    isVerified: true,
    isFeatured: false,
    rankScore: 69,
    minPrice: 1500,
    maxPrice: 5000,
    averageRating: 4.5,
    reviewCount: 63,
    responseTime: "Sous 3h",
    yearsInBusiness: 11,
  },
  {
    businessName: "Château des Roses",
    slug: "chateau-des-roses-hammamet",
    tagline: "Majesté et élégance au cœur de Hammamet",
    category: "Salles de mariage",
    categorySlug: "wedding-halls",
    city: "Hammamet",
    citySlug: "hammamet",
    plan: "PREMIUM",
    status: "ACTIVE",
    coverImage:
      "https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=1200&q=80",
    isVerified: true,
    isFeatured: true,
    rankScore: 95,
    minPrice: 6000,
    maxPrice: 30000,
    averageRating: 4.9,
    reviewCount: 174,
    responseTime: "Sous 1h",
    yearsInBusiness: 15,
  },
  {
    businessName: "Vision Photography",
    slug: "vision-photography-sousse",
    tagline: "Des photos qui racontent votre histoire",
    category: "Photographes",
    categorySlug: "photographers",
    city: "Sousse",
    citySlug: "sousse",
    plan: "PRO",
    status: "ACTIVE",
    coverImage:
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1200&q=80",
    isVerified: true,
    isFeatured: false,
    rankScore: 77,
    minPrice: 1000,
    maxPrice: 5000,
    averageRating: 4.7,
    reviewCount: 91,
    responseTime: "Sous 2h",
    yearsInBusiness: 6,
  },
  {
    businessName: "Sweet Dreams Pâtisserie",
    slug: "sweet-dreams-patisserie-tunis",
    tagline: "Chaque gâteau est une œuvre d'art",
    category: "Gâteaux",
    categorySlug: "sweets",
    city: "Tunis",
    citySlug: "tunis",
    plan: "PREMIUM",
    status: "PENDING",
    coverImage:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=80",
    isVerified: false,
    isFeatured: false,
    rankScore: 65,
    minPrice: 400,
    maxPrice: 3000,
    averageRating: 4.8,
    reviewCount: 47,
    responseTime: "Sous 4h",
    yearsInBusiness: 2,
  },
  {
    businessName: "Flowers & Co",
    slug: "flowers-co-sfax",
    tagline: "La beauté florale à votre service",
    category: "Fleuristes",
    categorySlug: "decorators",
    city: "Sfax",
    citySlug: "sfax",
    plan: "BASIC",
    status: "ACTIVE",
    coverImage:
      "https://images.unsplash.com/photo-1478146878799-0780a54b2d97?w=1200&q=80",
    isVerified: true,
    isFeatured: false,
    rankScore: 48,
    minPrice: 200,
    maxPrice: 2000,
    averageRating: 4.4,
    reviewCount: 38,
    responseTime: "Sous 3h",
    yearsInBusiness: 8,
  },
  {
    businessName: "Limousine Star",
    slug: "limousine-star-tunis",
    tagline: "Arrivez dans le style le plus élégant",
    category: "Transport",
    categorySlug: "traditional-services",
    city: "Tunis",
    citySlug: "tunis",
    plan: "PRO",
    status: "ACTIVE",
    coverImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    isVerified: true,
    isFeatured: false,
    rankScore: 71,
    minPrice: 300,
    maxPrice: 1200,
    averageRating: 4.6,
    reviewCount: 57,
    responseTime: "Sous 1h",
    yearsInBusiness: 10,
  },
  {
    businessName: "Pâtisserie Orient",
    slug: "patisserie-orient-kairouan",
    tagline: "Les saveurs authentiques de Kairouan",
    category: "Gâteaux",
    categorySlug: "sweets",
    city: "Kairouan",
    citySlug: "kairouan",
    plan: "BASIC",
    status: "ACTIVE",
    coverImage:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1200&q=80",
    isVerified: true,
    isFeatured: false,
    rankScore: 45,
    minPrice: 150,
    maxPrice: 1000,
    averageRating: 4.5,
    reviewCount: 72,
    responseTime: "Sous 4h",
    yearsInBusiness: 14,
  },
  {
    businessName: "DJ Fusion",
    slug: "dj-fusion-tunis",
    tagline: "La fusion parfaite entre tradition et modernité",
    category: "DJs",
    categorySlug: "djs",
    city: "Tunis",
    citySlug: "tunis",
    plan: "PRO",
    status: "ACTIVE",
    coverImage:
      "https://images.unsplash.com/photo-1571266028243-d220c6a54d64?w=1200&q=80",
    isVerified: true,
    isFeatured: false,
    rankScore: 80,
    minPrice: 600,
    maxPrice: 2500,
    averageRating: 4.8,
    reviewCount: 103,
    responseTime: "Sous 2h",
    yearsInBusiness: 7,
  },
  {
    businessName: "Beauté Orientale",
    slug: "beaute-orientale-sousse",
    tagline: "Sublime beauté pour votre grand jour",
    category: "Coiffure & Maquillage",
    categorySlug: "makeup-artists",
    city: "Sousse",
    citySlug: "sousse",
    plan: "PRO",
    status: "ACTIVE",
    coverImage:
      "https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?w=1200&q=80",
    isVerified: true,
    isFeatured: false,
    rankScore: 76,
    minPrice: 200,
    maxPrice: 800,
    averageRating: 4.7,
    reviewCount: 88,
    responseTime: "Sous 3h",
    yearsInBusiness: 5,
  },
  {
    businessName: "Villa Jasmin",
    slug: "villa-jasmin-la-marsa",
    tagline: "Luxe et raffinement face à la mer",
    category: "Salles de mariage",
    categorySlug: "wedding-halls",
    city: "Tunis",
    citySlug: "tunis",
    plan: "PREMIUM",
    status: "ACTIVE",
    coverImage:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200&q=80",
    isVerified: true,
    isFeatured: true,
    rankScore: 93,
    minPrice: 7000,
    maxPrice: 35000,
    averageRating: 4.9,
    reviewCount: 156,
    responseTime: "Sous 1h",
    yearsInBusiness: 8,
  },
  {
    businessName: "Band El Andalus",
    slug: "band-el-andalus-tunis",
    tagline: "La tradition musicale andalouse revisitée",
    category: "Groupes musicaux",
    categorySlug: "music-bands",
    city: "Tunis",
    citySlug: "tunis",
    plan: "PREMIUM",
    status: "ACTIVE",
    coverImage:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80",
    isVerified: true,
    isFeatured: false,
    rankScore: 84,
    minPrice: 2000,
    maxPrice: 8000,
    averageRating: 4.8,
    reviewCount: 79,
    responseTime: "Sous 2h",
    yearsInBusiness: 20,
  },
];

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats(): Promise<AdminStatsDto> {
    const [totalVendors, activeVendors, pendingVendors, all] =
      await Promise.all([
        this.prisma.vendor.count(),
        this.prisma.vendor.count({ where: { status: "ACTIVE" } }),
        this.prisma.vendor.count({ where: { status: "PENDING" } }),
        this.prisma.vendor.findMany({ select: { plan: true, status: true } }),
      ]);

    const mrr = all
      .filter((v) => v.status === "ACTIVE")
      .reduce((sum, v) => sum + (PLAN_REVENUE[v.plan] ?? 0), 0);

    return {
      totalUsers: 0,
      totalVendors,
      activeVendors,
      pendingVendors,
      totalBookings: 0,
      totalRevenue: mrr * 12,
      monthlyRecurringRevenue: mrr,
      averageSeoScore: 0,
      pendingReviews: 0,
    };
  }

  async listVendors(query: AdminQueryDto) {
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.plan) where.plan = query.plan;
    if (query.search) {
      where.OR = [
        { businessName: { contains: query.search, mode: "insensitive" } },
        { city: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 100;

    const [vendors, total] = await Promise.all([
      this.prisma.vendor.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.vendor.count({ where }),
    ]);

    return {
      data: vendors.map((v) => ({
        id: v.id,
        name: v.businessName,
        category: v.category,
        city: v.city,
        plan: v.plan,
        status: v.status,
        joined: v.createdAt,
        revenue: PLAN_REVENUE[v.plan] ?? 0,
      })),
      total,
      page,
      limit,
    };
  }

  async actionOnVendor(
    vendorId: string,
    dto: AdminVendorActionDto,
  ): Promise<void> {
    await this.prisma.vendor.update({
      where: { id: vendorId },
      data: { status: dto.status },
    });
  }

  async seed(): Promise<{ inserted: number }> {
    await this.prisma.vendor.deleteMany({});
    await this.prisma.vendor.createMany({ data: SEED_VENDORS as any });
    return { inserted: SEED_VENDORS.length };
  }

  async listUsers(_query: AdminQueryDto) {
    throw new Error("Not implemented");
  }

  async banUser(_userId: string, _reason: string): Promise<void> {}

  async listBookings(_query: AdminQueryDto) {
    throw new Error("Not implemented");
  }

  async processRefund(_bookingId: string, _amount?: number): Promise<void> {}

  async getAuditLog(_query: AdminQueryDto) {
    throw new Error("Not implemented");
  }
}
