import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

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
  @IsString()
  deviceName: string;

  @IsNotEmpty()
  @IsString()
  issueDescription: string;

  @IsNotEmpty()
  @IsString()
  customerName: string;

  @IsNotEmpty()
  @IsString()
  customerPhone: string;

  @IsOptional()
  @IsNumber()
  customerPaid?: number;

  @IsOptional()
  @IsArray()
  imageDeviceBefore: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RepairRequestServices)
  repairRequestServices?: RepairRequestServices[];
}
