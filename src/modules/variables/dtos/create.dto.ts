import { Type } from 'class-transformer';
import {
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
  @IsString()
  @IsNotEmpty()
  productId: string;

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
