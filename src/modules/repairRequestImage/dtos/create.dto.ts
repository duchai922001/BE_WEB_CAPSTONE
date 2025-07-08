import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { RepairImageType } from '../repairRequestImage.entity';

export class CreateRepairRequestImageDto {
  @IsString()
  @IsNotEmpty()
  repairRequestId: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  note: string;

  @IsEnum(RepairImageType, { message: 'Type must be either before or after' })
  type: RepairImageType;
}
