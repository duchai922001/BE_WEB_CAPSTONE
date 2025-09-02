import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class ProductStock {
  @IsString()
  productId: string;

  @IsString()
  @IsOptional()
  variableId?: string;

  @IsNumber()
  typeProduct: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  serialCodes?: string[];

  @IsNumber()
  @IsOptional()
  quantity: number;
}

export class ReturnOrderDto {
  @IsMongoId()
  orderId: string;

  @IsNumber()
  @Min(1)
  returnAmount: number;

  @IsString()
  reason: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductStock)
  @IsOptional()
  products?: ProductStock[];
}
