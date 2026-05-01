import { IsString, Min } from 'class-validator';
import { AuthPayLoadDto } from './auth.dto';

export class SignupPayLoadDto extends AuthPayLoadDto {
  @IsString()
  @Min(4)
  username!: string;
}
