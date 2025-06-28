import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { OtpType } from 'src/common/enums/otp';

export class CreateOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(4, 10)
  code: string;

  @IsEnum(OtpType)
  purpose: OtpType;
  
  @IsDateString()
  expiresAt: string;
}
