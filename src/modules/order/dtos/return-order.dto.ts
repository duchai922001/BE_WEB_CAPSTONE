import { IsMongoId, IsNumber, IsString, Min } from 'class-validator';

export class ReturnOrderDto {
  @IsMongoId()
  orderId: string;

  @IsNumber()
  @Min(1)
  returnAmount: number;

  @IsString()
  reason: string;
}
