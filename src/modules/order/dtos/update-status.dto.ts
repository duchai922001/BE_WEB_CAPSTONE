import {
  IsArray,
  ValidateNested,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

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

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  status: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductStock)
  @IsOptional()
  products?: ProductStock[];
}
