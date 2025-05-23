import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
  MinLength,
} from 'class-validator';
import { Subscription } from 'rxjs';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @Matches(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, {
    message: 'Ad alanı sadece harf içermelidir.',
  })
  fullName!: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz' })
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password!: string;

  subscriptions?: Subscription[];
}
