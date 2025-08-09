import {
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
export enum TypeRepair {
  NORMAL = 'NORMAL',
  WARRANTY = 'WARRANTY',
}
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

  @IsEnum(TypeRepair)
  typeRepair: TypeRepair;
}
