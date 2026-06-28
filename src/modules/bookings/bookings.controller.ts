import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { BookingsService } from "./bookings.service";
import {
  CreateBookingDto,
  UpdateBookingDto,
  BookingStatus,
} from "./dto/booking.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@ApiTags("bookings")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: "[Couple] Request a new booking" })
  create(@CurrentUser() user: any, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(user.id, dto);
  }

  @Get("my")
  @ApiOperation({ summary: "[Couple] Get my bookings" })
  getMyBookings(
    @CurrentUser() user: any,
    @Query("status") status?: BookingStatus,
  ) {
    return this.bookingsService.findForCouple(user.id, status);
  }

  @Get("vendor")
  @UseGuards(RolesGuard)
  @Roles("VENDOR")
  @ApiOperation({ summary: "[Vendor] Get bookings for my vendor profile" })
  getVendorBookings(
    @CurrentUser() user: any,
    @Query("status") status?: BookingStatus,
  ) {
    return this.bookingsService.findForVendorByUserId(user.id, status);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get booking detail" })
  findOne(@Param("id") id: string) {
    return this.bookingsService.findOne(id);
  }

  @Put(":id/confirm")
  @UseGuards(RolesGuard)
  @Roles("VENDOR")
  @ApiOperation({ summary: "[Vendor] Confirm a pending booking" })
  confirm(@CurrentUser() user: any, @Param("id") id: string) {
    return this.bookingsService.confirm(user.id, id);
  }

  @Put(":id/complete")
  @ApiOperation({ summary: "Mark booking as completed" })
  complete(@Param("id") id: string) {
    return this.bookingsService.complete(id);
  }

  @Put(":id/cancel")
  @ApiOperation({ summary: "Cancel a booking" })
  cancel(
    @CurrentUser() user: any,
    @Param("id") id: string,
    @Body("reason") reason?: string,
  ) {
    return this.bookingsService.cancel(user.id, id, reason);
  }

  @Put(":id")
  @UseGuards(RolesGuard)
  @Roles("ADMIN")
  @ApiOperation({ summary: "[Admin] Update booking details" })
  update(@Param("id") id: string, @Body() dto: UpdateBookingDto) {
    return this.bookingsService.update(id, dto);
  }
}
