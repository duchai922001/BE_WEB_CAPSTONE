import { IsMongoId, IsNumber, Min } from 'class-validator';

export class UpdateCustomerPaidDto {
  @IsMongoId()
  repairRequestId: string;

  @IsNumber()
  @Min(0)
  amount: number;
}
