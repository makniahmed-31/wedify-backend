import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Review } from "@prisma/client";
import {
  CreateReviewDto,
  ModerationDto,
  ReviewResponseDto,
  ReviewStatus,
} from "./dto/review.dto";

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  private toDto(r: Review): ReviewResponseDto {
    return {
      id: r.id,
      vendorId: r.vendorId,
      coupleId: r.coupleId,
      bookingId: r.bookingId ?? undefined,
      overallRating: r.overallRating,
      communicationRating: r.communicationRating ?? undefined,
      valueRating: r.valueRating ?? undefined,
      comment: r.comment,
      status: r.status as ReviewStatus,
      vendorReply: r.vendorReply ?? undefined,
      createdAt: r.createdAt,
    };
  }

  async create(
    coupleId: string,
    dto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    const existing = await this.prisma.review.findFirst({
      where: { coupleId, vendorId: dto.vendorId },
    });
    if (existing)
      throw new BadRequestException("You have already reviewed this vendor");

    const review = await this.prisma.review.create({
      data: {
        coupleId,
        vendorId: dto.vendorId,
        bookingId: dto.bookingId,
        overallRating: dto.overallRating,
        communicationRating: dto.communicationRating,
        valueRating: dto.valueRating,
        comment: dto.comment,
        status: ReviewStatus.PENDING,
      },
    });
    return this.toDto(review);
  }

  async findByVendor(vendorId: string, page: number, limit: number) {
    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { vendorId, status: ReviewStatus.APPROVED },
        orderBy: { createdAt: "desc" },
        skip: (+page - 1) * +limit,
        take: +limit,
      }),
      this.prisma.review.count({
        where: { vendorId, status: ReviewStatus.APPROVED },
      }),
    ]);
    return {
      data: data.map(this.toDto.bind(this)),
      total,
      page: +page,
      limit: +limit,
    };
  }

  async findLatest(limit = 6) {
    const reviews = await this.prisma.review.findMany({
      where: { status: ReviewStatus.APPROVED },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return reviews.map(this.toDto.bind(this));
  }

  async findPending(page: number, limit: number) {
    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { status: ReviewStatus.PENDING },
        orderBy: { createdAt: "desc" },
        skip: (+page - 1) * +limit,
        take: +limit,
      }),
      this.prisma.review.count({ where: { status: ReviewStatus.PENDING } }),
    ]);
    return { data: data.map(this.toDto.bind(this)), total };
  }

  async moderate(
    reviewId: string,
    dto: ModerationDto,
  ): Promise<ReviewResponseDto> {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!review) throw new NotFoundException("Review not found");

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: { status: dto.status, moderationNote: dto.moderationNote },
    });

    if (
      dto.status === ReviewStatus.APPROVED ||
      dto.status === ReviewStatus.REJECTED
    ) {
      await this.recalculateVendorRating(review.vendorId);
    }

    return this.toDto(updated);
  }

  async vendorReply(
    vendorUserId: string,
    reviewId: string,
    reply: string,
  ): Promise<ReviewResponseDto> {
    const vendor = await this.prisma.vendor.findFirst({
      where: { userId: vendorUserId },
    });
    if (!vendor) throw new NotFoundException("Vendor profile not found");

    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!review) throw new NotFoundException("Review not found");
    if (review.vendorId !== vendor.id)
      throw new ForbiddenException("Not your review");

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: { vendorReply: reply },
    });
    return this.toDto(updated);
  }

  async findOne(reviewId: string): Promise<ReviewResponseDto> {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!review) throw new NotFoundException("Review not found");
    return this.toDto(review);
  }

  private async recalculateVendorRating(vendorId: string): Promise<void> {
    const result = await this.prisma.review.aggregate({
      where: { vendorId, status: ReviewStatus.APPROVED },
      _avg: { overallRating: true },
      _count: { id: true },
    });

    await this.prisma.vendor.update({
      where: { id: vendorId },
      data: {
        averageRating: result._avg.overallRating ?? 0,
        reviewCount: result._count.id,
      },
    });
  }
}
