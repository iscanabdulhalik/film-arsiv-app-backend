import { User } from '../user/entities/user.entity';
import { Profile } from './entities/profile.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfileRepository } from './profile-repository';

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async createDefaultProfile(user: User): Promise<Profile> {
    return this.profileRepository.create({
      profileName: `${user.email.split('@')[0]} (Default)`,
      isDefault: true,
      user,
    });
  }

  async createProfile(user: User, profileName: string): Promise<Profile> {
    return this.profileRepository.create({
      profileName,
      user,
    });
  }

  async getDefaultProfile(userId: string): Promise<Profile> {
    return this.profileRepository.findOne({
      where: { user: { id: userId }, isDefault: true },
    });
  }

  async getUserProfiles(userId: string): Promise<Profile[]> {
    const profiles = await this.profileRepository.find({
      where: { user: { id: userId } },
    });
    if (!profiles || profiles.length === 0) {
      throw new NotFoundException('No profiles found for this user');
    }
    return profiles;
  }
}
