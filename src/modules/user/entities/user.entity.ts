import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Role } from 'src/common/enums/role.enum';
import { Profile } from 'src/modules/profile/entities/profile.entity';
import { Order } from 'src/modules/order/entities/order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column()
  fullName: string;

  @OneToMany(() => Profile, (profile) => profile.user, { cascade: true })
  profiles: Profile[];

  @OneToMany(() => Order, (order) => order.user, { cascade: true })
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
