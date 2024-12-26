import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { OrderModule } from '../order/order.module'; // OrderModule'ü import ediyoruz
import { OrderController } from '../order/order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from '../subscription/entities/subscription.entity';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';
import { SubscriptionModule } from '../subscription/subscription.module';
import { StripeController } from './stripe.controller';

@Module({
  imports: [
    forwardRef(() => OrderModule),
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([Subscription, User]),
    forwardRef(() => SubscriptionModule),
  ],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
