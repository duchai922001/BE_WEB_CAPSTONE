import {
  IsOptional,
  IsMongoId,
  IsString,
  IsEnum,
  IsArray,
  IsNumber,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductType } from 'src/common/enums/productType';
import { CreateProductDto, CreateVariableDto } from './create.dto';
import { PartialType } from '@nestjs/mapped-types';

export class SerialCodeDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  serialCode: string;

  @IsString()
  action: 'new' | 'edit';
}

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsMongoId()
  @IsOptional()
  categoryId?: string;

  @IsMongoId()
  @IsOptional()
  brandId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  barcode?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  costPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sellPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsString()
  mainImage?: string;

  @IsOptional()
  @IsBoolean()
  isInstallment?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  listImage?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SerialCodeDto)
  @IsOptional()
  serialCodes?: SerialCodeDto[];
}
