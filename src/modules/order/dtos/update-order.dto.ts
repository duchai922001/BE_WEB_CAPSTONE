import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { OrderNormalStatus } from 'src/common/enums/orderStatus';

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
  @IsString()
  shippingProvider?: string;

  @IsOptional()
  @IsString()
  trackingCode?: string;

  @IsOptional()
  @IsNumber()
  feeShip?: number;
}
