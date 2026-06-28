import {
  Controller,
  Get,
  Put,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Body,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { NotificationsService } from "./notifications.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@ApiTags("notifications")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: "Get my in-app notifications" })
  getMyNotifications(
    @CurrentUser() user: any,
    @Query("unreadOnly") unreadOnly?: boolean,
  ) {
    return this.notificationsService.getMyNotifications(user.id, unreadOnly);
  }

  @Get("unread-count")
  @ApiOperation({ summary: "Get count of unread notifications" })
  getUnreadCount(@CurrentUser() user: any) {
    return this.notificationsService.getUnreadCount(user.id);
  }

  @Put(":id/read")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Mark a notification as read" })
  markAsRead(@CurrentUser() user: any, @Param("id") id: string) {
    return this.notificationsService.markAsRead(user.id, id);
  }

  @Put("read-all")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Mark all notifications as read" })
  markAllAsRead(@CurrentUser() user: any) {
    return this.notificationsService.markAllAsRead(user.id);
  }

  @Put("preferences")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Update notification channel preferences" })
  updatePreferences(
    @CurrentUser() user: any,
    @Body() preferences: Record<string, boolean>,
  ) {
    return this.notificationsService.updatePreferences(user.id, preferences);
  }
}
