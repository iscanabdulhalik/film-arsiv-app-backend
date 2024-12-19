// import {
//   Entity,
//   Column,
//   ManyToOne,
//   PrimaryGeneratedColumn,
//   CreateDateColumn,
//   UpdateDateColumn,
// } from 'typeorm';
// import { User } from 'src/modules/user/entities/user.entity';

// @Entity()
// export class Subscription {
//   @PrimaryGeneratedColumn()
//   id: string;

//   @Column({ default: 'inactive' })
//   status: 'active' | 'inactive';

//   @CreateDateColumn()
//   startDate: Date;

//   @UpdateDateColumn()
//   endDate: Date;

//   @ManyToOne(() => User, (user) => user.subscriptions)
//   user: User;
// }
