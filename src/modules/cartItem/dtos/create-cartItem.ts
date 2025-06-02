import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateCartItemDto {
  @IsNotEmpty()
  @IsMongoId()
  cartId: string;

  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @IsOptional()
  @IsBoolean()
  isSelected: boolean;
}
