import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { User } from './modules/user/entities/user.entity';
import { Profile } from './modules/profile/entities/profile.entity';
import { ProfileModule } from './modules/profile/profile.module';
import { JwtModule } from '@nestjs/jwt';
import { StreamModule } from './streaming/stream.module';
import { Movie } from './modules/movie/entities/movie.entity';
import { MovieModule } from './modules/movie/movie.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { OrderModule } from './modules/order/order.module';
import { Order } from './modules/order/entities/order.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MovieVersion } from './modules/movie/entities/movie.version.entity';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { Subscription } from './modules/subscription/entities/subscription.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        ssl: { rejectUnauthorized: false },
        entities: [User, Profile, Movie, Order, MovieVersion, Subscription],
        synchronize: false,
      }),
    }),
    AuthModule,
    UserModule,
    ProfileModule,
    MovieModule,
    StreamModule,
    StripeModule,
    OrderModule,
    SubscriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
