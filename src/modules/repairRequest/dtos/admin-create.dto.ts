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

export class CreateRepairRequestAdminDto {
  @IsString()
  @IsOptional()
  technicianId: string;

  @IsNotEmpty()
  @IsString()
  deviceName: string;

  @IsNotEmpty()
  @IsString()
  diagnosis: string;

  @IsOptional()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  customerName: string;

  @IsOptional()
  @IsString()
  customerPhone: string;

  @IsOptional()
  @IsNumber()
  customerPaid?: number;

  @IsOptional()
  @IsArray()
  photosReceiving: string[];
}
