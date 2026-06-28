import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { VendorsModule } from "./modules/vendors/vendors.module";
import { ServicesModule } from "./modules/services/services.module";
import { BookingsModule } from "./modules/bookings/bookings.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { SubscriptionsModule } from "./modules/subscriptions/subscriptions.module";
import { SearchModule } from "./modules/search/search.module";
import { SeoModule } from "./modules/seo/seo.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { AdminModule } from "./modules/admin/admin.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { MarketplaceModule } from "./modules/marketplace/marketplace.module";
import { BlogModule } from "./modules/blog/blog.module";

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,

    AuthModule,
    UsersModule,
    VendorsModule,
    ServicesModule,
    BookingsModule,
    ReviewsModule,
    SubscriptionsModule,
    SearchModule,
    SeoModule,
    AnalyticsModule,
    AdminModule,
    NotificationsModule,
    MarketplaceModule,
    BlogModule,
  ],
})
export class AppModule {}
