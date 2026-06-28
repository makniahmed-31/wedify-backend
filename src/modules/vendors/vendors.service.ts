import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Vendor } from "@prisma/client";
import {
  CreateVendorProfileDto,
  UpdateVendorProfileDto,
  VendorResponseDto,
  VendorCategory,
  VendorStatus,
} from "./dto/vendor.dto";

@Injectable()
export class VendorsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(
    userId: string,
    dto: CreateVendorProfileDto,
  ): Promise<VendorResponseDto> {
    const vendor = await this.prisma.vendor.create({
      data: {
        userId,
        businessName: dto.businessName,
        category: dto.category as string,
        description: dto.description,
        city: dto.city,
        website: dto.website,
        startingPrice: dto.startingPrice,
        status: "PENDING",
        plan: "BASIC",
      },
    });
    return this.toDto(vendor, userId);
  }

  async getMyProfile(userId: string) {
    const vendor = await this.prisma.vendor.findFirst({ where: { userId } });
    if (!vendor) throw new NotFoundException("Vendor profile not found");
    return this.toPublic(vendor);
  }

  async updateProfile(userId: string, dto: UpdateVendorProfileDto) {
    const vendor = await this.prisma.vendor.findFirst({ where: { userId } });
    if (!vendor) throw new NotFoundException("Vendor profile not found");

    const data: Partial<Vendor> = {};
    if (dto.businessName !== undefined) data.businessName = dto.businessName;
    if (dto.tagline !== undefined) data.tagline = dto.tagline;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.city !== undefined) data.city = dto.city;
    if (dto.website !== undefined) data.website = dto.website;
    if (dto.phone !== undefined) data.phone = dto.phone;
    if (dto.whatsapp !== undefined) data.whatsapp = dto.whatsapp;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.facebook !== undefined) data.facebook = dto.facebook;
    if (dto.instagram !== undefined) data.instagram = dto.instagram;
    if (dto.youtube !== undefined) data.youtube = dto.youtube;
    if (dto.tiktok !== undefined) data.tiktok = dto.tiktok;
    if (dto.videoUrl !== undefined) data.videoUrl = dto.videoUrl;
    if (dto.gallery !== undefined) data.gallery = dto.gallery as any;
    if (dto.minPrice !== undefined) data.minPrice = dto.minPrice as any;
    if (dto.maxPrice !== undefined) data.maxPrice = dto.maxPrice as any;
    if (dto.yearsInBusiness !== undefined)
      data.yearsInBusiness = dto.yearsInBusiness;

    const updated = await this.prisma.vendor.update({
      where: { id: vendor.id },
      data,
    });
    return this.toPublic(updated);
  }

  async findById(vendorId: string): Promise<VendorResponseDto> {
    const vendor = await this.prisma.vendor.findFirst({
      where: { id: vendorId, status: "ACTIVE" },
    });
    if (!vendor) throw new NotFoundException("Vendor not found");
    return this.toDto(vendor);
  }

  async findAll(
    filters: Record<string, string | number | undefined>,
    page: number,
    limit: number,
  ) {
    const where: any = { status: "ACTIVE" };
    if (filters.category) where.categorySlug = filters.category;
    if (filters.city) where.citySlug = filters.city;
    if (filters.minPrice) where.minPrice = { gte: filters.minPrice };
    if (filters.maxPrice) where.maxPrice = { lte: filters.maxPrice };

    const [data, total] = await Promise.all([
      this.prisma.vendor.findMany({
        where,
        orderBy: { rankScore: "desc" },
        skip: (+page - 1) * +limit,
        take: +limit,
      }),
      this.prisma.vendor.count({ where }),
    ]);
    return {
      data: data.map((v) => this.toPublic(v)),
      total,
      page,
      limit,
    };
  }

  async updateStatus(
    vendorId: string,
    status: string,
  ): Promise<VendorResponseDto> {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
    });
    if (!vendor) throw new NotFoundException("Vendor not found");
    const updated = await this.prisma.vendor.update({
      where: { id: vendorId },
      data: { status },
    });
    return this.toDto(updated);
  }

  async uploadMedia(_vendorId: string, _userId: string, _files: unknown[]) {
    throw new Error("Not implemented");
  }

  async getVendorStats(_vendorId: string) {
    throw new Error("Not implemented");
  }

  async findBySlug(slug: string) {
    const vendor = await this.prisma.vendor.findFirst({ where: { slug } });
    if (!vendor) throw new NotFoundException("Vendor not found");
    return this.toPublic(vendor);
  }

  toPublic(v: Vendor) {
    return {
      id: v.id,
      slug: v.slug,
      businessName: v.businessName,
      tagline: v.tagline,
      description: v.description,
      category: {
        id: v.categorySlug ?? "other",
        slug: v.categorySlug ?? "other",
        name: v.category ?? "Autre",
        icon: "🏪",
        vendorCount: 0,
      },
      city: {
        id: v.citySlug ?? "other",
        slug: v.citySlug ?? "other",
        name: v.city ?? "Tunisie",
        vendorCount: 0,
      },
      coverImage: v.coverImage,
      plan: v.plan,
      status: v.status,
      rating: v.averageRating,
      reviewCount: v.reviewCount,
      isVerified: v.isVerified,
      isFeatured: v.isFeatured,
      rankScore: v.rankScore,
      minPrice: v.minPrice ? Number(v.minPrice) : 0,
      maxPrice: v.maxPrice ? Number(v.maxPrice) : 0,
      responseTime: v.responseTime,
      phone: v.phone,
      whatsapp: v.whatsapp,
      email: v.email,
      website: v.website,
      facebook: v.facebook,
      instagram: v.instagram,
      youtube: v.youtube,
      tiktok: v.tiktok,
      videoUrl: v.videoUrl,
      gallery: (v.gallery as string[]) ?? [],
      yearsInBusiness: v.yearsInBusiness,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
    };
  }

  private toDto(vendor: Vendor, userId = ""): VendorResponseDto {
    return {
      id: vendor.id,
      userId,
      businessName: vendor.businessName,
      category: vendor.category as VendorCategory,
      status: vendor.status as VendorStatus,
      averageRating: vendor.averageRating,
      reviewCount: vendor.reviewCount,
      createdAt: vendor.createdAt,
    };
  }
}
