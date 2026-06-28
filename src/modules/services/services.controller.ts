import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { ServicesService } from "./services.service";
import { CreateServiceDto, UpdateServiceDto } from "./dto/service.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Public } from "../../common/decorators/public.decorator";

@ApiTags("services")
@Controller("vendors/:vendorId/services")
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "List all active services for a vendor (public)" })
  findAll(@Param("vendorId") vendorId: string) {
    return this.servicesService.findByVendor(vendorId);
  }

  @Public()
  @Get(":id")
  @ApiOperation({ summary: "Get a single service (public)" })
  findOne(@Param("id") id: string) {
    return this.servicesService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("VENDOR")
  @Post()
  @ApiOperation({ summary: "[Vendor] Create a new service offering" })
  create(@Param("vendorId") vendorId: string, @Body() dto: CreateServiceDto) {
    return this.servicesService.create(vendorId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("VENDOR")
  @Put(":id")
  @ApiOperation({ summary: "[Vendor] Update a service" })
  update(
    @Param("vendorId") vendorId: string,
    @Param("id") id: string,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.servicesService.update(vendorId, id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("VENDOR")
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "[Vendor] Delete a service" })
  remove(@Param("vendorId") vendorId: string, @Param("id") id: string) {
    return this.servicesService.remove(vendorId, id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("VENDOR")
  @Put(":id/toggle")
  @ApiOperation({ summary: "[Vendor] Toggle service active state" })
  toggleActive(@Param("vendorId") vendorId: string, @Param("id") id: string) {
    return this.servicesService.toggleActive(vendorId, id);
  }
}
