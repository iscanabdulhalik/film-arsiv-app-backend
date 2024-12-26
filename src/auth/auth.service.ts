import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { Profile } from 'src/modules/profile/entities/profile.entity';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/modules/user/dto/login-user.dto';
import { UserService } from 'src/modules/user/user.service';
import { JwtPayload } from 'src/common/types/jwtPayload';
import { DataSource } from 'typeorm';
import { request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;

    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    return await this.dataSource.transaction(async (manager) => {
      const hashedPassword = await argon2.hash(createUserDto.password);
      const userToSave: Partial<User> = {
        email: createUserDto.email,
        password: hashedPassword,
        fullName: createUserDto.fullName, // fullName veya ilgili alan
      };

      // Kullanıcıyı kaydet
      const newUser = await manager.getRepository(User).save(userToSave);

      if (!newUser) {
        throw new BadRequestException('Failed to create user');
      }

      // Profile kaydetme
      await manager.getRepository(Profile).save({
        profileName: `${newUser.email.split('@')[0]} (Default)`,
        isDefault: true,
        user: newUser, // User ilişkisi
      });

      delete newUser.password; // Güvenlik için şifreyi kaldır

      return newUser;
    });
  }

  async loginWithCredentials(
    loginUserDto: LoginUserDto,
  ): Promise<{ access_token: string }> {
    const user = await this.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials: User not found.');
    }

    return this.login(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials: User not found.');
    }

    try {
      const isPasswordValid = await argon2.verify(user.password, password);
      if (!isPasswordValid) {
        throw new UnauthorizedException(
          'Invalid credentials: Incorrect password.',
        );
      }

      return user;
    } catch (error) {
      console.error('Error during user validation:', error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload: JwtPayload = {
      userId: user.id,
      role: user.role,
      email: user.email,
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  async getMe(userId: string): Promise<User | null> {
    return this.userService.getMe(userId);
  }
}
