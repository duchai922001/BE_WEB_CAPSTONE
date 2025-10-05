import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRepairServiceDto {
  @IsString()
  @IsNotEmpty()
  createBy: string;

  @IsNotEmpty()
  @IsMongoId()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  repairWarrantyPolicyId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  costPrice: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  sellPrice: number;

  @IsString()
  @IsNotEmpty()
  estimatedTime: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  stock: number;

  @IsString()
  @IsNotEmpty()
  image: string;
}
