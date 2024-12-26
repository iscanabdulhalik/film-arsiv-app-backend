import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { User } from '../user/entities/user.entity';
import {
  Subscription,
  SubscriptionStatus,
} from '../subscription/entities/subscription.entity';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);
  private readonly webhookSecret: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2024-11-20.acacia',
      },
    );
    this.webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
  }

  verifyWebhook(rawBody: Buffer, signature: string): Stripe.Event {
    if (!signature) {
      throw new Error('Missing stripe-signature header');
    }

    if (!this.webhookSecret) {
      throw new Error('Stripe webhook secret is not configured');
    }

    try {
      return this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.webhookSecret,
      );
    } catch (err) {
      this.logger.error(
        `Webhook signature verification failed: ${err.message}`,
      );
      throw new Error('Invalid webhook signature');
    }
  }

  async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ): Promise<void> {
    const userId = session.metadata?.userId;
    if (!userId) {
      throw new Error('Missing userId in session metadata');
    }

    try {
      this.logger.log(`Processing subscription for user ${userId}`);

      const subscription = await this.stripe.subscriptions.retrieve(
        session.subscription as string,
      );

      await this.createOrUpdateSubscription({
        userId,
        subscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        priceId: subscription.items.data[0]?.price.id,
      });
    } catch (error) {
      this.logger.error(`Failed to process subscription: ${error.message}`);
      throw error;
    }
  }

  async createCheckoutSession(
    userId: string,
    priceId: string,
  ): Promise<Stripe.Checkout.Session> {
    try {
      const userEmail = await this.getUserEmail(userId);

      return await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        metadata: { userId },
        success_url: this.configService.get<string>('STRIPE_SUCCESS_URL'),
        cancel_url: this.configService.get<string>('STRIPE_CANCEL_URL'),
        customer_email: userEmail,
      });
    } catch (error) {
      this.logger.error(`Failed to create checkout session: ${error.message}`);
      throw error;
    }
  }

  private async createOrUpdateSubscription(data: {
    userId: string;
    subscriptionId: string;
    status: string;
    currentPeriodEnd: Date;
    priceId?: string;
  }): Promise<void> {
    try {
      // Check if subscription exists
      let subscription = await this.subscriptionRepository.findOne({
        where: { stripeSubscriptionId: data.subscriptionId },
      });

      if (subscription) {
        // Update existing subscription
        await this.subscriptionRepository.update(subscription.id, {
          status: data.status as SubscriptionStatus,
          currentPeriodEnd: data.currentPeriodEnd,
          stripePriceId: data.priceId,
          ...(data.status === SubscriptionStatus.CANCELED
            ? { canceledAt: new Date() }
            : {}),
        });
      } else {
        // Create new subscription
        subscription = this.subscriptionRepository.create({
          stripeSubscriptionId: data.subscriptionId,
          stripePriceId: data.priceId,
          status: data.status as SubscriptionStatus,
          currentPeriodEnd: data.currentPeriodEnd,
          userId: data.userId,
        });
        await this.subscriptionRepository.save(subscription);
      }

      this.logger.log(
        `Subscription ${data.subscriptionId} updated for user ${data.userId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to update subscription in database: ${error.message}`,
      );
      throw error;
    }
  }

  private async getUserEmail(userId: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.email;
  }

  // Additional helper methods for subscription management
  async getActiveSubscription(userId: string): Promise<Subscription | null> {
    return this.subscriptionRepository.findOne({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
      order: {
        currentPeriodEnd: 'DESC',
      },
    });
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { stripeSubscriptionId: subscriptionId },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription ${subscriptionId} not found`);
    }

    await this.stripe.subscriptions.cancel(subscriptionId);

    await this.subscriptionRepository.update(subscription.id, {
      status: SubscriptionStatus.CANCELED,
      canceledAt: new Date(),
    });
  }
}
