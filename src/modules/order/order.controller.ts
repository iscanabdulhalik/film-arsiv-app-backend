import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import Stripe from 'stripe';

@Controller('orders')
export class OrderController {
  private stripe: Stripe;

  constructor(private readonly orderService: OrderService) {
    this.stripe = new Stripe(
      'sk_test_51PsVzzBmyHRr2GT8iDsfOFbh6cghv9ULL8tO2mEKQgPdHwmMpEUsWaE0wnAZZItcXWWOQF7wViKx0ELT8SjwDohw00Vq2nq0FE',
      {
        apiVersion: '2024-11-20.acacia',
      },
    );
  }

  // Stripe Checkout oturumu oluştur ve siparişi kaydet
  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body('productPriceId') productPriceId: string,
    @Body('userId') userId: string,
  ) {
    // 1. Stripe Checkout oturumu oluştur
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: productPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription', // abonelik
      success_url: 'http://localhost:3010/success',
      cancel_url: 'http://localhost:3010/cancel',
    });

    // 2. Siparişi veritabanına kaydet
    const order = await this.orderService.createOrder({
      userId,
      stripeSessionId: session.id,
    });

    // 3. Oturum ID'sini döndür
    return { sessionId: session.id, order };
  }

  // Sipariş durumunu güncelle
  @Patch('update-status/:stripeSessionId')
  async updateOrderStatus(
    @Param('stripeSessionId') stripeSessionId: string,
    @Body('status') status: 'completed' | 'failed',
  ) {
    await this.orderService.updateOrderStatus(stripeSessionId, status);
    return { message: 'Order status updated successfully' };
  }

  // Webhook Endpoint (Stripe tarafından çağrılır)
  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    const sig = body['headers']['stripe-signature']; // Webhook imzası
    let event: Stripe.Event;

    try {
      // Webhook doğrulama
      event = this.stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.error('Webhook signature verification failed.', err.message);
      throw new Error('Webhook Error');
    }

    // Event türüne göre işlem yap
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Sipariş durumu doğrudan 'completed' olarak ayarlanır
        await this.orderService.updateOrderStatus(session.id, 'completed');
        break;
      }

      case 'checkout.session.expired': {
        const expiredSession = event.data.object as Stripe.Checkout.Session;

        // Sipariş durumu 'failed' olarak güncellenir
        await this.orderService.updateOrderStatus(expiredSession.id, 'failed');
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }
}
