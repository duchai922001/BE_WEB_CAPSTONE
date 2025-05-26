import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ActionTypeConfig, RefConfig } from 'src/common/enums/config';

export class CreateActionLogDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  refId: RefConfig;

  @IsString()
  @IsNotEmpty()
  actionType: ActionTypeConfig;

  @IsString()
  @IsOptional()
  description: string;
}
