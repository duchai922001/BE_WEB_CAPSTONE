import { Type } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsMongoId()
  orderId: string;

  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @IsMongoId()
  @IsOptional()
  variableId: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  quantity?: number;
}
