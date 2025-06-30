import {
  IsArray,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RepairRequestStatus } from '../../../common/enums/repairRequestStatus';

export class RepairRequestServices {
  @IsOptional()
  @IsMongoId()
  repairServiceId: string;

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
  repairRequestCode: string;

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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RepairRequestServices)
  repairRequestServices?: RepairRequestServices[];
}
