import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { AdminService } from "./admin.service";
import { AdminVendorActionDto, AdminQueryDto } from "./dto/admin.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@ApiTags("admin")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("stats")
  @ApiOperation({ summary: "[Admin] Dashboard KPI stats" })
  getStats() {
    return this.adminService.getDashboardStats();
  }

  @Get("vendors")
  @ApiOperation({ summary: "[Admin] List all vendors with filters" })
  listVendors(@Query() query: AdminQueryDto) {
    return this.adminService.listVendors(query);
  }

  @Put("vendors/:id/action")
  @ApiOperation({ summary: "[Admin] Approve, suspend, or reactivate a vendor" })
  vendorAction(@Param("id") id: string, @Body() dto: AdminVendorActionDto) {
    return this.adminService.actionOnVendor(id, dto);
  }

  @Post("seed")
  @ApiOperation({
    summary: "[Admin] Seed demo vendors (skips if DB already has data)",
  })
  seed() {
    return this.adminService.seed();
  }

  @Get("users")
  @ApiOperation({ summary: "[Admin] List all users" })
  listUsers(@Query() query: AdminQueryDto) {
    return this.adminService.listUsers(query);
  }

  @Get("audit-log")
  @ApiOperation({ summary: "[Admin] Get admin action audit log" })
  auditLog(@Query() query: AdminQueryDto) {
    return this.adminService.getAuditLog(query);
  }
}
