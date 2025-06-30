import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRepairRequestServiceDto {
  @IsNotEmpty()
  @IsMongoId()
  repairRequestId: string;

  @IsOptional()
  @IsMongoId()
  repairServiceId?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
