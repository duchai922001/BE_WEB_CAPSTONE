import { IsMongoId, IsNumber, Min } from 'class-validator';

export class PayDebtDto {
  @IsMongoId()
  orderId: string;

  @IsNumber()
  @Min(1)
  paidAmount: number;
}
