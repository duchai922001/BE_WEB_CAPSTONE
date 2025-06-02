import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateOrderDto {
  @IsNotEmpty()
  @IsMongoId()
  employeeId: string;

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
  @IsNumber()
  status: boolean;

  @IsOptional()
  @IsBoolean()
  isReturnedOrder?: boolean;

  @IsOptional()
  @IsString()
  reason?: string;
}
