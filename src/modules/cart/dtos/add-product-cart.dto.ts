import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddToCartDto {
  @IsString()
  @IsNotEmpty({ message: 'productId is required' })
  productId: string;

  @IsString()
  @IsOptional()
  variableId: string;

  @IsString()
  @IsOptional()
  attributeId: string;

  @IsNumber()
  @IsOptional()
  quantity: number;
}
