import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductType } from 'src/common/enums/productType';

export class OrderItems {
  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @IsMongoId()
  @IsOptional()
  variableId: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @IsNotEmpty()
  @IsEnum(ProductType)
  typeProduct: ProductType;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  serialCodes?: string[];
}

export class AdminCreateOrderDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsOptional()
  @IsMongoId()
  employeeId: string;

  @IsOptional()
  @IsString()
  discountType: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discountValue: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  totalAmount: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  customerPaid: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItems)
  orderItems?: OrderItems[];
}
