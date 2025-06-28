import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRepairRequestImageDto {
  @IsString()
  @IsNotEmpty()
  repairRequestId: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  note: string;
}
