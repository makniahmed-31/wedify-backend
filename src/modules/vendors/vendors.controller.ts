import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
} from "@nestjs/swagger";
import { FilesInterceptor } from "@nestjs/platform-express";
import { VendorsService } from "./vendors.service";
import {
  CreateVendorProfileDto,
  UpdateVendorProfileDto,
} from "./dto/vendor.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";

@ApiTags("vendors")
@Controller("vendors")
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Browse vendors (public) with filters" })
  findAll(
    @Query("category") category?: string,
    @Query("city") city?: string,
    @Query("minPrice") minPrice?: number,
    @Query("maxPrice") maxPrice?: number,
    @Query("page") page = 1,
    @Query("limit") limit = 20,
  ) {
    return this.vendorsService.findAll(
      { category, city, minPrice, maxPrice },
      page,
      limit,
    );
  }

  @Public()
  @Get("slug/:slug")
  @ApiOperation({ summary: "Get vendor by slug" })
  findBySlug(@Param("slug") slug: string) {
    return this.vendorsService.findBySlug(slug);
  }

  @Public()
  @Get(":id")
  @ApiOperation({ summary: "Get vendor public profile" })
  findOne(@Param("id") id: string) {
    return this.vendorsService.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("VENDOR")
  @Post("profile")
  @ApiOperation({ summary: "[Vendor] Create vendor profile" })
  createProfile(@CurrentUser() user: any, @Body() dto: CreateVendorProfileDto) {
    return this.vendorsService.createProfile(user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("VENDOR")
  @Get("profile/me")
  @ApiOperation({ summary: "[Vendor] Get my vendor profile" })
  getMyProfile(@CurrentUser() user: any) {
    return this.vendorsService.getMyProfile(user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("VENDOR")
  @Put("profile/me")
  @ApiOperation({ summary: "[Vendor] Update my vendor profile" })
  updateProfile(@CurrentUser() user: any, @Body() dto: UpdateVendorProfileDto) {
    return this.vendorsService.updateProfile(user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("VENDOR")
  @Post("profile/me/media")
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FilesInterceptor("files", 10))
  @ApiOperation({ summary: "[Vendor] Upload photos/videos to profile" })
  uploadMedia(
    @CurrentUser() user: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.vendorsService.uploadMedia(user.vendorId, user.id, files);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Put(":id/status")
  @ApiOperation({ summary: "[Admin] Update vendor status (approve/suspend)" })
  updateStatus(@Param("id") id: string, @Body("status") status: string) {
    return this.vendorsService.updateStatus(id, status);
  }
}
