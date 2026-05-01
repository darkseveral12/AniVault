import { IsEmail, IsStrongPassword, IsString } from 'class-validator';

export class AuthPayLoadDto {
  @IsEmail()
  email!: string;

  @IsStrongPassword()
  @IsString()
  password!: string;
}
