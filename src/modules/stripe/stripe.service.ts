import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(
      'sk_test_51PsVzzBmyHRr2GT8iDsfOFbh6cghv9ULL8tO2mEKQgPdHwmMpEUsWaE0wnAZZItcXWWOQF7wViKx0ELT8SjwDohw00Vq2nq0FE',
      {
        apiVersion: '2024-11-20.acacia',
      },
    );
  }

  async createCheckoutSession(
    productPriceId: string,
  ): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: productPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription', // payment yerine subscription kullanıyoruz
      success_url: 'http://localhost:3010/success',
      cancel_url: 'http://localhost:3010/cancel',
    });
  }
}
