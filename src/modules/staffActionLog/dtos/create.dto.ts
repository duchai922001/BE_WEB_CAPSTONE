import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ActionLogType, ActionTypeConfig } from 'src/common/enums/config';

export class CreateActionLogDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  actionType: ActionLogType;

  @IsString()
  @IsOptional()
  description: string;
}
