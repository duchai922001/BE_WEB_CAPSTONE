import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsMongoId,
  IsEnum,
} from 'class-validator';
import { PaymentMethod } from 'src/common/enums/payment';

export class CreatePaymentDto {
  @IsMongoId()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsOptional()
  repairRequestId: string;

  @IsNotEmpty()
  amount: number;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  method: PaymentMethod;

  @IsString()
  @IsNotEmpty()
  transactionCode: string;
}
