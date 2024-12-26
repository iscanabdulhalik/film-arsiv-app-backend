import { Injectable } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user: DeepPartial<User> = {
      email: createUserDto.email,
      password: createUserDto.password,
      fullName: createUserDto.fullName,
      // subscriptions: [],
      profiles: [],
    };
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async getUserWithSubscriptions(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['subscriptions'],
    });
  }

  async getMe(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['profiles'],
    });
  }
}
