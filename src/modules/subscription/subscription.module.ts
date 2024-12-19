// import { Module, forwardRef } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Subscription } from './entities/subscription.entity';
// import { SubscriptionService } from './subscription.service';
// import { AuthModule } from 'src/auth/auth.module';
// import { User } from '../user/entities/user.entity';
// import { UserModule } from '../user/user.module';
// import { WebhookController } from './subscription.controller';
// import { StripeModule } from '../stripe/stripe.module';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([Subscription, User]),
//     forwardRef(() => AuthModule),
//     forwardRef(() => UserModule),
//     forwardRef(() => StripeModule),
//   ],
//   controllers: [WebhookController],
//   providers: [SubscriptionService],
//   exports: [SubscriptionService],
// })
// export class SubscriptionModule {}
