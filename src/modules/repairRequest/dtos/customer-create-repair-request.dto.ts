import {
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RepairRequestStatus } from '../../../common/enums/repairRequestStatus';

export class RepairRequestServices {
  @IsOptional()
  @IsMongoId()
  productId: string;

  @IsOptional()
  @IsString()
  note: string;
}

export class CreateRepairRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @IsString()
  deviceName: string;

  @IsNotEmpty()
  @IsString()
  issueDescription: string;

  @IsOptional()
  @IsNumber()
  estimatedCost?: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  preferredDropoffDate: Date;

  @IsOptional()
  @IsNumber()
  customerPaid?: number;

  @IsOptional()
  @IsEnum(RepairRequestStatus)
  status?: RepairRequestStatus;
}
