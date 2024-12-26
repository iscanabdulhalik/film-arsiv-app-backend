import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  TRIALING = 'trialing',
  UNPAID = 'unpaid',
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryColumn('uuid', { default: () => 'gen_random_uuid()' })
  id: string;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.INCOMPLETE,
  })
  status: SubscriptionStatus;

  @Column({ type: 'timestamp' })
  currentPeriodEnd: Date;

  @Column()
  stripePriceId: string;

  @Column({ nullable: true })
  canceledAt?: Date;

  @Column()
  startDate: Date;

  @Column()
  userId: string;

  @Column()
  endDate: Date;

  @Column({ nullable: true })
  stripeSubscriptionId: string;

  @ManyToOne(() => User, (user) => user.subscriptions)
  user: User;
}
