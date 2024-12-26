import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionService } from './subscription.service';
import { StripeController } from '../stripe/stripe.controller';
import { StripeModule } from '../stripe/stripe.module';
import { UserModule } from '../user/user.module';
import { SubscriptionController } from './subscription.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription]),
    forwardRef(() => StripeModule), // StripeModule undefined olabilir
    forwardRef(() => UserModule), // StripeModule dahil edildi
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
