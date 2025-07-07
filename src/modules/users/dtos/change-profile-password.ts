import { IsOptional, IsString, IsEmail } from 'class-validator';

export class changeProfilePassword {
  @IsString()
  currentPassword?: string;

  @IsString()
  newPassword?: string;

}