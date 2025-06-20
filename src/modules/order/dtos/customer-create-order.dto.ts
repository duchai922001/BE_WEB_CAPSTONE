import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { OrderNormalStatus } from 'src/common/enums/orderStatus';

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
  discountValue: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  totalAmount: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  estimatedRevenue: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  lastAmount: number;

  @IsNotEmpty()
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
  @IsArray()
  @IsMongoId({ each: true })
  payments?: string[]; 

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  orderItems?: string[]; 
}
