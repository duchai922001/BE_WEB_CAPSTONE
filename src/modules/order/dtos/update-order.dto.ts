import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { OrderNormalStatus } from 'src/common/enums/orderStatus';
import { ShippingProvider } from 'src/common/enums/shipping-provider';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  discountType: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discountValue: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  totalAmount: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  estimatedRevenue: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lastAmount: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  customerPaid: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  customerDept?: number;

  @IsOptional()
  @IsEnum(OrderNormalStatus)
  method: OrderNormalStatus;

  @IsOptional()
  @IsBoolean()
  isReturnedOrder?: boolean;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsEnum(ShippingProvider)
  shippingProvider?: ShippingProvider;

  @IsOptional()
  @IsString()
  trackingCode?: string;

  @IsOptional()
  @IsNumber()
  feeShip?: number;
}
