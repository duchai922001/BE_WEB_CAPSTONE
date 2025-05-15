import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

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
  @ArrayMaxSize(2)
  @ValidateNested({ each: true })
  @Type(() => AttributeDto)
  attribute: AttributeDto[];

  @IsNumber()
  costPrice: number;

  @IsNumber()
  @IsOptional()
  sellPrice: number;

  @IsNumber()
  @IsOptional()
  stock: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  mainImage: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  listImage?: string[];
}
