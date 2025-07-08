import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRepairInvoiceItemDto {
  @IsMongoId()
  repairRequestId: string;

  @IsMongoId()
  @IsOptional()
  repairServiceId?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  laborCost: number;

  @IsString()
  @IsOptional()
  note?: string;
}
