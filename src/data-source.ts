import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { MovieVersion } from './modules/movie/entities/movie.version.entity';
import { Order } from './modules/order/entities/order.entity';
import { Movie } from './modules/movie/entities/movie.entity';
import { Profile } from './modules/profile/entities/profile.entity';
import { User } from './modules/user/entities/user.entity';
import 'reflect-metadata';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: { rejectUnauthorized: false },
  entities: [User, Profile, Movie, Order, MovieVersion],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});

export default AppDataSource;
