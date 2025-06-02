import { IsOptional, IsString } from 'class-validator';

export class UpdateNotificationDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  targeUrl: string;
}
