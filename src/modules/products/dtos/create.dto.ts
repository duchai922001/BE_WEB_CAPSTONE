import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

class AttributeDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

class VariableInputDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeDto)
  @IsNotEmpty()
  attribute: { key: string; value: string }[];

  @IsNumber()
  @IsNotEmpty()
  costPrice: number;

  @IsNumber()
  @IsOptional()
  sellPrice: number;

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  mainImage?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  listImage?: string[];
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'barCode is required' })
  barCode: string;

  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsNumber()
  @IsOptional()
  costPrice: number;

  @IsNumber()
  @IsOptional()
  sellPrice: number;

  @IsNumber()
  @IsOptional()
  stock: number;

  @IsString()
  @IsNotEmpty({ message: 'description is required' })
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'brandId is required' })
  brandId: string;

  @IsString()
  @IsNotEmpty({ message: 'categoryId is required' })
  categoryId: string;

  @IsString()
  @IsOptional()
  mainImage: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  listImage: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariableInputDto)
  @IsOptional()
  variablesProduct?: VariableInputDto[];

  @IsBoolean()
  @IsOptional()
  isSerial: boolean;

  @ValidateIf((o) => o.isSerial === true)
  @IsArray({ message: 'serials must be an array of strings' })
  @IsString({ each: true, message: 'each serial must be a string' })
  @ArrayNotEmpty({ message: 'serials cannot be empty if isSerial is true' })
  serials?: string[];
}
