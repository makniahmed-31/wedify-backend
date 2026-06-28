import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { SubscriptionsService } from "./subscriptions.service";
import {
  CreateSubscriptionDto,
  SubscriptionPlan,
} from "./dto/subscription.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";

@ApiTags("subscriptions")
@Controller("subscriptions")
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Public()
  @Get("plans")
  @ApiOperation({
    summary: "Get all available subscription plans and features",
  })
  getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("VENDOR")
  @Get("my")
  @ApiOperation({ summary: "[Vendor] Get current subscription" })
  getMySubscription(@CurrentUser() user: any) {
    return this.subscriptionsService.getMySubscription(user.vendorId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("VENDOR")
  @Post()
  @ApiOperation({ summary: "[Vendor] Subscribe to a plan" })
  subscribe(@CurrentUser() user: any, @Body() dto: CreateSubscriptionDto) {
    return this.subscriptionsService.subscribe(user.vendorId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("VENDOR")
  @Put("upgrade")
  @ApiOperation({ summary: "[Vendor] Upgrade to a higher plan" })
  upgrade(@CurrentUser() user: any, @Body("plan") plan: SubscriptionPlan) {
    return this.subscriptionsService.upgrade(user.vendorId, plan);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("VENDOR")
  @Delete("cancel")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "[Vendor] Cancel subscription at period end" })
  cancel(@CurrentUser() user: any) {
    return this.subscriptionsService.cancel(user.vendorId);
  }

  @Post("webhook/stripe")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Stripe subscription webhook handler" })
  handleStripeWebhook(@Body() event: any) {
    return this.subscriptionsService.handleStripeWebhook(event);
  }
}
