import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  CreateBookingDto,
  UpdateBookingDto,
  BookingResponseDto,
  BookingStatus,
} from "./dto/booking.dto";
import { Booking } from "@prisma/client";

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  private toDto(b: Booking): BookingResponseDto {
    return {
      id: b.id,
      coupleId: b.coupleId,
      vendorId: b.vendorId,
      serviceId: b.serviceId ?? undefined,
      status: b.status as BookingStatus,
      weddingDate: b.weddingDate,
      totalAmount: b.totalAmount ? Number(b.totalAmount) : undefined,
      depositAmount: b.depositAmount ? Number(b.depositAmount) : undefined,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    };
  }

  async create(
    coupleId: string,
    dto: CreateBookingDto,
  ): Promise<BookingResponseDto> {
    const vendor = await this.prisma.vendor.findFirst({
      where: { id: dto.vendorId, status: "ACTIVE" },
    });
    if (!vendor) throw new NotFoundException("Vendor not found or not active");

    const booking = await this.prisma.booking.create({
      data: {
        coupleId,
        vendorId: dto.vendorId,
        serviceId: dto.serviceId,
        weddingDate: new Date(dto.weddingDate),
        guestCount: dto.guestCount,
        notes: dto.notes,
        status: BookingStatus.PENDING,
      },
    });
    return this.toDto(booking);
  }

  async findForCouple(
    coupleId: string,
    status?: BookingStatus,
  ): Promise<BookingResponseDto[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { coupleId, ...(status ? { status } : {}) },
      orderBy: { createdAt: "desc" },
    });
    return bookings.map(this.toDto.bind(this));
  }

  async findForVendor(
    vendorId: string,
    status?: BookingStatus,
  ): Promise<BookingResponseDto[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { vendorId, ...(status ? { status } : {}) },
      orderBy: { createdAt: "desc" },
    });
    return bookings.map(this.toDto.bind(this));
  }

  async findForVendorByUserId(
    userId: string,
    status?: BookingStatus,
  ): Promise<BookingResponseDto[]> {
    const vendor = await this.prisma.vendor.findFirst({ where: { userId } });
    if (!vendor) return [];
    return this.findForVendor(vendor.id, status);
  }

  async findOne(bookingId: string): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException("Booking not found");
    return this.toDto(booking);
  }

  async confirm(
    vendorUserId: string,
    bookingId: string,
  ): Promise<BookingResponseDto> {
    const vendor = await this.prisma.vendor.findFirst({
      where: { userId: vendorUserId },
    });
    if (!vendor) throw new NotFoundException("Vendor profile not found");

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException("Booking not found");
    if (booking.vendorId !== vendor.id)
      throw new ForbiddenException("Not your booking");
    if (booking.status !== BookingStatus.PENDING)
      throw new BadRequestException("Booking is not pending");

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CONFIRMED },
    });
    return this.toDto(updated);
  }

  async complete(bookingId: string): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException("Booking not found");
    if (booking.status !== BookingStatus.CONFIRMED)
      throw new BadRequestException("Booking is not confirmed");

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.COMPLETED },
    });
    return this.toDto(updated);
  }

  async cancel(
    _userId: string,
    bookingId: string,
    reason?: string,
  ): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException("Booking not found");
    if (
      ![BookingStatus.PENDING, BookingStatus.CONFIRMED].includes(
        booking.status as BookingStatus,
      )
    ) {
      throw new BadRequestException(
        "Cannot cancel a booking with status " + booking.status,
      );
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CANCELLED, cancellationReason: reason },
    });
    return this.toDto(updated);
  }

  async update(
    bookingId: string,
    dto: UpdateBookingDto,
  ): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException("Booking not found");
    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: dto as any,
    });
    return this.toDto(updated);
  }
}
