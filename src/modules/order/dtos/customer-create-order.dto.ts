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
import { PaymentMethod, PaymentType } from 'src/common/enums/payment';
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
}

export class CustomerCreateOrderDto {
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

  @IsMongoId()
  addressId: string;

  @IsNotEmpty()
  @IsEnum(PaymentType, {
    message: `paymentType must be one of: ${Object.values(PaymentType).join(', ')}`,
  })
  paymentType: PaymentType;

  @IsNotEmpty()
  @IsEnum(PaymentMethod, {
    message: `paymentMethod must be one of: ${Object.values(PaymentMethod).join(', ')}`,
  })
  paymentMethod: PaymentMethod;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItems)
  orderItems?: OrderItems[];
}
