import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';

@Controller('stripe')
export class StripeController {
  private readonly logger = new Logger(StripeController.name);

  constructor(private readonly stripeService: StripeService) {}

  @Post('create-subscription')
  async createSubscription(
    @Body('userId') userId: string,
    @Body('priceId') priceId: string,
  ) {
    if (!userId || !priceId) {
      throw new HttpException(
        'userId and priceId are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const session = await this.stripeService.createCheckoutSession(
        userId,
        priceId,
      );
      return { sessionId: session.id, url: session.url };
    } catch (error) {
      this.logger.error(`Error creating subscription: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Uç nokta: Webhook dinleyici
  @Post('webhook')
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

        if (event.type === 'checkout.session.completed') {
          const session = event.data.object as Stripe.Checkout.Session;
          await this.stripeService.handleCheckoutSessionCompleted(session);
          this.logger.log(`Processed event: ${event.type}`);
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
