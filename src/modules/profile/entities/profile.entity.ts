import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  profileName: string;

  @Column({ nullable: true })
  profileImg: string;

  @ManyToOne(() => User, (user) => user.profiles, { onDelete: 'CASCADE' })
  user: User;

  @Column({ default: false })
  isDefault: boolean;
}
