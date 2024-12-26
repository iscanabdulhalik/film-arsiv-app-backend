import { Controller, Post, Req, Res, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';

@Controller('webhook')
export class StripeController {
  private readonly logger = new Logger(StripeController.name);
  private readonly eventHandlers: Record<
    string,
    (event: Stripe.Event) => Promise<void>
  >;

  constructor(private readonly stripeService: StripeService) {
    this.eventHandlers = {
      'checkout.session.completed': async (event: Stripe.Event) => {
        const session = event.data.object as Stripe.Checkout.Session;
        await this.stripeService.handleCheckoutSessionCompleted(session);
      },
    };
  }

  @Post('stripe')
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    let rawBody = '';
    req.on('data', (chunk) => {
      rawBody += chunk;
    });
    req.on('end', async () => {
      try {
        const signature = req.headers['stripe-signature'] as string;
        const event = this.stripeService.verifyWebhook(
          Buffer.from(rawBody, 'utf-8'),
          signature,
        );

        const handler = this.eventHandlers[event.type];
        if (handler) {
          await handler(event);
          this.logger.log(`Successfully processed ${event.type}`);
        } else {
          this.logger.warn(`Unhandled event type: ${event.type}`);
        }

        res.status(HttpStatus.OK).send();
      } catch (error) {
        this.logger.error(`Webhook Error: ${error.message}`);
        res
          .status(HttpStatus.BAD_REQUEST)
          .send(`Webhook Error: ${error.message}`);
      }
    });
  }
}
