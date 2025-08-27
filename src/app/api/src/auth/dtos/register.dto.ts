import { RegisterDto } from '../auth.service';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterRequestDto implements RegisterDto {
    @IsEmail()
    email: string;
  
    @IsString()
    @MinLength(6)
    password: string;
  }