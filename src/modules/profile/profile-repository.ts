import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileRepository {
  constructor(
    @InjectRepository(Profile)
    private readonly repository: Repository<Profile>,
  ) {}

  async findProfilesByUserId(userId: string): Promise<Profile | null> {
    return this.repository.findOne({
      where: { user: { id: userId }, isDefault: true },
    });
  }

  async create(profile: Partial<Profile>): Promise<Profile> {
    const newProfile = this.repository.create(profile);
    return this.repository.save(newProfile);
  }

  async find(options?: any): Promise<Profile[]> {
    return this.repository.find(options);
  }

  async findOne(options?: any): Promise<Profile | null> {
    return this.repository.findOne(options);
  }

  async save(profile: Profile): Promise<Profile> {
    return this.repository.save(profile);
  }
}
