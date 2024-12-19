import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { OrderModule } from '../order/order.module'; // OrderModule'ü import ediyoruz
import { OrderController } from '../order/order.controller';

@Module({
  imports: [OrderModule], // OrderModule burada kullanıma hazır hale gelir
  controllers: [OrderController],
  providers: [StripeService],
})
export class StripeModule {}
