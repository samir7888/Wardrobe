import { LoginDto } from '../auth.service';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginRequestDto implements LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
