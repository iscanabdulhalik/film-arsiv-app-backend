// import { Body, Controller, Post } from '@nestjs/common';
// import { StripeService } from '../stripe/stripe.service';
// import { SubscriptionService } from './subscription.service';
// import Stripe from 'stripe';

// @Controller('subscription')
// export class WebhookController {
//   constructor(
//     private readonly stripeService: StripeService,
//     private readonly subscriptionService: SubscriptionService,
//   ) {}

//   @Post('webhook')
//   async handleStripeWebhook(@Body() body: any): Promise<void> {
//     const event = this.stripeService.verifyWebhook(body);

//     if (event.type === 'checkout.session.completed') {
//       const session = event.data.object as Stripe.Checkout.Session;
//       const userId = session.metadata.userId;

//       await this.subscriptionService.createSubscription(userId);
//     }
//   }
// }
