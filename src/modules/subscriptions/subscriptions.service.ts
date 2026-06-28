import { Injectable } from "@nestjs/common";
import {
  CreateSubscriptionDto,
  SubscriptionResponseDto,
  PlanFeaturesDto,
  SubscriptionPlan,
} from "./dto/subscription.dto";

@Injectable()
export class SubscriptionsService {
  async getPlans(): Promise<PlanFeaturesDto[]> {
    // TODO: Return static or DB-driven plan feature matrix
    throw new Error("Not implemented");
  }

  async getMySubscription(_vendorId: string): Promise<SubscriptionResponseDto> {
    // TODO: Find active subscription for vendor
    throw new Error("Not implemented");
  }

  async subscribe(
    _vendorId: string,
    _dto: CreateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    // TODO: Create Stripe subscription, persist record
    throw new Error("Not implemented");
  }

  async upgrade(
    _vendorId: string,
    _newPlan: SubscriptionPlan,
  ): Promise<SubscriptionResponseDto> {
    // TODO: Prorate and upgrade Stripe subscription
    throw new Error("Not implemented");
  }

  async cancel(_vendorId: string): Promise<SubscriptionResponseDto> {
    // TODO: Cancel at period end via Stripe
    throw new Error("Not implemented");
  }

  async handleStripeWebhook(_event: any): Promise<void> {
    // TODO: Handle subscription.updated, invoice.payment_failed, etc.
  }

  async checkFeatureAccess(
    _vendorId: string,
    _feature: string,
  ): Promise<boolean> {
    // TODO: Gate features by active plan
    throw new Error("Not implemented");
  }
}
