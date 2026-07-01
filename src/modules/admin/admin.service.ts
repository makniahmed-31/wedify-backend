import { Injectable, NotImplementedException } from "@nestjs/common";
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

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats(): Promise<AdminStatsDto> {
    const [totalVendors, activeVendors, pendingVendors, all, totalUsers, totalBookings, pendingReviews] =
      await Promise.all([
        this.prisma.vendor.count(),
        this.prisma.vendor.count({ where: { status: "ACTIVE" } }),
        this.prisma.vendor.count({ where: { status: "PENDING" } }),
        this.prisma.vendor.findMany({ select: { plan: true, status: true } }),
        this.prisma.user.count(),
        this.prisma.booking.count(),
        this.prisma.review.count({ where: { status: "PENDING" } }),
      ]);

    const mrr = all
      .filter((v) => v.status === "ACTIVE")
      .reduce((sum, v) => sum + (PLAN_REVENUE[v.plan] ?? 0), 0);

    return {
      totalUsers,
      totalVendors,
      activeVendors,
      pendingVendors,
      totalBookings,
      totalRevenue: mrr * 12,
      monthlyRecurringRevenue: mrr,
      averageSeoScore: 0,
      pendingReviews,
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

  async listUsers(_query: AdminQueryDto) {
    throw new NotImplementedException();
  }

  async banUser(_userId: string, _reason: string): Promise<void> {}

  async listBookings(_query: AdminQueryDto) {
    throw new NotImplementedException();
  }

  async processRefund(_bookingId: string, _amount?: number): Promise<void> {}

  async getAuditLog(_query: AdminQueryDto) {
    throw new NotImplementedException();
  }
}
