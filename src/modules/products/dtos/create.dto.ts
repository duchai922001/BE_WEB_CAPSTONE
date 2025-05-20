import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

export class AttributeDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

export class CreateVariableDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeDto)
  attribute: AttributeDto[];

  @IsBoolean()
  @IsOptional()
  isSerial?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  serials?: string[];

  @IsNumber()
  @IsNotEmpty()
  costPrice: number;

  @IsNumber()
  @IsNotEmpty()
  sellPrice: number;

  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  mainImage?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  listImage?: string[];

  @IsBoolean()
  @IsOptional()
  isDelete?: boolean;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsOptional()
  costPrice?: number;

  @IsNumber()
  @IsOptional()
  sellPrice?: number;

  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsMongoId()
  @IsNotEmpty()
  brandId: string | Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  categoryId: string | Types.ObjectId;

  @IsString()
  @IsOptional()
  mainImage?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  listImage?: string[];

  @IsBoolean()
  @IsOptional()
  isVariable?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariableDto)
  @IsOptional()
  variablesProduct?: CreateVariableDto[];

  @IsBoolean()
  @IsOptional()
  isSerial?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  serials?: string[];

  @IsString()
  @IsOptional()
  barcode?: string;
}
