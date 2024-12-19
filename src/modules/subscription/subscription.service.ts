// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Subscription } from './entities/subscription.entity';
// import { User } from '../user/entities/user.entity';

// @Injectable()
// export class SubscriptionService {
//   constructor(
//     @InjectRepository(Subscription)
//     private subscriptionRepo: Repository<Subscription>,
//   ) {}

//   async createSubscription(userId: string): Promise<Subscription> {
//     const currentDate = new Date();
//     const oneMonthLater = new Date();
//     oneMonthLater.setMonth(currentDate.getMonth() + 1);

//     const subscription = this.subscriptionRepo.create({
//       user: { id: userId } as User,
//       startDate: currentDate,
//       endDate: oneMonthLater,
//       status: 'active',
//     });
//     return this.subscriptionRepo.save(subscription);
//   }

//   async activateSubscription(userId: string): Promise<void> {
//     const subscription = await this.subscriptionRepo.findOne({
//       where: { user: { id: userId }, status: 'inactive' },
//     });
//     if (subscription) {
//       subscription.status = 'active';
//       subscription.startDate = new Date();
//       const oneMonthLater = new Date();
//       oneMonthLater.setMonth(new Date().getMonth() + 1);
//       subscription.endDate = oneMonthLater;

//       await this.subscriptionRepo.save(subscription);
//     }
//   }

//   async expireInactiveSubscriptions(): Promise<void> {
//     const now = new Date();
//     const oneMonthLater = new Date();
//     oneMonthLater.setMonth(now.getMonth() + 1);
//     const expiredSubscriptions = await this.subscriptionRepo.find({
//       where: { status: 'active', endDate: oneMonthLater },
//     });

//     for (const subscription of expiredSubscriptions) {
//       subscription.status = 'inactive';
//       await this.subscriptionRepo.save(subscription);
//     }
//   }

//   async getUserSubscriptions(userId: string): Promise<Subscription[]> {
//     return this.subscriptionRepo.find({ where: { user: { id: userId } } });
//   }

//   async cancelSubscription(subscriptionId: number): Promise<void> {
//     await this.subscriptionRepo.update(subscriptionId, {
//       status: 'inactive',
//       endDate: new Date(),
//     });
//   }

//   async hasActiveSubscription(userId: string): Promise<boolean> {
//     const activeSubscription = await this.subscriptionRepo.findOne({
//       where: { user: { id: userId }, status: 'active' },
//     });
//     return !!activeSubscription;
//   }
// }
