import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsMongoId,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductType } from 'src/common/enums/productType';
class AttributeDto {
  @IsString()
  @IsNotEmpty({ message: 'key of attribute is required' })
  key: string;

  @IsString()
  @IsNotEmpty({ message: 'value of attribute is required' })
  value: string;
}

export class CreateVariableDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeDto)
  attributes: AttributeDto[];

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
  image: string;
}
export class CreateProductDto {
  @IsNotEmpty()
  @IsMongoId()
  categoryId: string;

  @IsNotEmpty()
  @IsMongoId()
  brandId: string;

  @IsOptional()
  @IsArray()
  variables: CreateVariableDto[];

  @IsNotEmpty()
  @IsString()
  name: string;

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

  @IsNotEmpty()
  @IsString()
  barcode: string;

  @IsArray()
  @IsOptional()
  serials?: string[];

  @IsOptional()
  @IsEnum(ProductType)
  typeProduct?: ProductType;

  @IsString()
  @IsOptional()
  mainImage: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  listImage: string[];
}
