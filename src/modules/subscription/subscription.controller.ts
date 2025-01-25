import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get(':userId')
  async getUserSubscription(@Param('userId') userId: string) {
    const subscription =
      await this.subscriptionService.getActiveSubscription(userId);
    if (!subscription) {
      throw new NotFoundException(
        'No active subscription found for this user.',
      );
    }
    return subscription;
  }
}
