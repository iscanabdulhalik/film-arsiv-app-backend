import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ProfileModule } from '../profile/profile.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from './user-repository';
// import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ProfileModule,
    forwardRef(() => AuthModule),
    // forwardRef(() => SubscriptionModule), // SubscriptionModule döngüsel bağımlılığı çözer
  ],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserService, UserRepository],
})
export class UserModule {}
