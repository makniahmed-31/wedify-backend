import { Injectable } from "@nestjs/common";
import {
  SendNotificationDto,
  NotificationResponseDto,
  NotificationChannel,
} from "./dto/notification.dto";

@Injectable()
export class NotificationsService {
  async send(dto: SendNotificationDto): Promise<void> {
    const channels = dto.channels || [
      NotificationChannel.EMAIL,
      NotificationChannel.IN_APP,
    ];
    // TODO: Dispatch to each channel (email via nodemailer, SMS via Twilio, in-app via DB)
    await Promise.all(channels.map((ch) => this.dispatchToChannel(ch, dto)));
  }

  async getMyNotifications(
    _userId: string,
    _unreadOnly = false,
  ): Promise<NotificationResponseDto[]> {
    // TODO: Fetch in-app notifications from DB
    throw new Error("Not implemented");
  }

  async markAsRead(_userId: string, _notificationId: string): Promise<void> {
    // TODO: Update isRead flag
  }

  async markAllAsRead(_userId: string): Promise<void> {
    // TODO: Bulk update isRead for all user notifications
  }

  async getUnreadCount(_userId: string): Promise<{ count: number }> {
    // TODO: Count unread in-app notifications
    throw new Error("Not implemented");
  }

  async updatePreferences(
    _userId: string,
    _preferences: Record<string, boolean>,
  ): Promise<void> {
    // TODO: Save per-channel notification opt-in preferences
  }

  private async dispatchToChannel(
    channel: NotificationChannel,
    _dto: SendNotificationDto,
  ): Promise<void> {
    switch (channel) {
      case NotificationChannel.EMAIL:
        // TODO: Send via nodemailer with HTML template
        break;
      case NotificationChannel.SMS:
        // TODO: Send via Twilio SMS
        break;
      case NotificationChannel.IN_APP:
        // TODO: Persist to notifications table
        break;
      case NotificationChannel.PUSH:
        // TODO: Send via FCM / web push
        break;
    }
  }
}
