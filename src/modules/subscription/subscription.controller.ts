import { Controller, Post, Req, Res, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from '../stripe/stripe.service';
import Stripe from 'stripe';

@Controller('subscription')
export class SubscriptionController {
  private readonly logger = new Logger(SubscriptionController.name);

  constructor(private readonly stripeService: StripeService) {}

  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const signature = req.headers['stripe-signature'] as string;
      const event = this.stripeService.verifyWebhook(req.body, signature);

      // Handle the event
      await this.stripeService.handleCheckoutSessionCompleted(
        event.data.object as Stripe.Checkout.Session,
      );

      res.status(HttpStatus.OK).send();
    } catch (error) {
      this.logger.error(`Webhook Error: ${error.message}`);
      res
        .status(HttpStatus.BAD_REQUEST)
        .send(`Webhook Error: ${error.message}`);
    }
  }
}
