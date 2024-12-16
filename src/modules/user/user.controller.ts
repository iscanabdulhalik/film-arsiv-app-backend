import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from '../profile/profile.service';
import { UserService } from './user.service';
import { Profile } from '../profile/entities/profile.entity';
import { User } from './entities/user.entity';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, AuthGuard)
export class UserController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
  ) {}

  @Get('')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUser(@Param('id') userId: string): Promise<User> {
    return this.userService.findUserById(userId);
  }

  @Get(':id/profiles')
  async getUserProfiles(@Param('id') userId: string): Promise<Profile[]> {
    return this.profileService.getUserProfiles(userId);
  }

  @Post(':id/profiles')
  async addProfile(
    @Param('id') userId: string,
    @Body('profileName') profileName: string,
  ): Promise<Profile> {
    const user: User = await this.userService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.profileService.createProfile(user, profileName);
  }
}
