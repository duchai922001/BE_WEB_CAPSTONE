import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  phoneOrEmail: string;

  @IsString()
  password: string;
}
