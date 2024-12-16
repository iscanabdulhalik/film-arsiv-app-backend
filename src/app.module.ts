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
import { MovieVersion } from './modules/movie/entities/movie.version.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: 'filmArsiv',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: 5435,
      host: 'localhost',
      username: 'postgres',
      password: 'iscan',
      database: 'filmArsiv',
      entities: [User, Profile, Movie, MovieVersion],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    ProfileModule,
    MovieModule,
    StreamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
