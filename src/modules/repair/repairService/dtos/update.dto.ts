import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class UpdateRepairServiceDto {
  @IsOptional()
  @IsString()
  createBy?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  costPrice?: number;

  @IsOptional()
  @IsNumber()
  sellPrice?: number;

  @IsOptional()
  @IsString()
  estimatedTime?: string;

  @IsOptional()
  @IsString()
  warrantlyPeriod?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsString()
  image?: string;
}
