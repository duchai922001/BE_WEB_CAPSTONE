import { IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateRepairRequestInfoDto {
  @IsOptional()
  @IsString()
  deviceSerial?: string;

  @IsOptional()
  @IsString()
  issueDescription?: string;

  @IsOptional()
  @IsArray()
  imageAfter?: string[];
}
