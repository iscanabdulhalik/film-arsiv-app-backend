import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Subscription,
  SubscriptionStatus,
} from './entities/subscription.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createSubscription(userId: string): Promise<Subscription> {
    const user = await this.userRepo.findOneOrFail({ where: { id: userId } });

    const subscription = this.subscriptionRepo.create({
      user,
      userId,
      status: SubscriptionStatus.ACTIVE,
      stripeSubscriptionId: '', // Add your Stripe subscription ID
      stripePriceId: '', // Add your Stripe price ID
      currentPeriodEnd: new Date(), // Add your subscription end date
    });

    return this.subscriptionRepo.save(subscription);
  }

  async getActiveSubscription(userId: string): Promise<Subscription | null> {
    return this.subscriptionRepo.findOne({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
      relations: ['user'],
    });
  }

  async deactivateSubscription(userId: string): Promise<void> {
    const subscription = await this.subscriptionRepo.findOne({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    if (subscription) {
      subscription.status = SubscriptionStatus.INACTIVE;
      subscription.canceledAt = new Date();
      await this.subscriptionRepo.save(subscription);
    }
  }
}
