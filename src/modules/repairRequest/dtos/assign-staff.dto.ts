import {
  IsOptional,
  IsMongoId,
  ArrayNotEmpty,
  IsArray,
  IsString,
} from 'class-validator';

export class AssignRepairRequestDto {
  @IsOptional()
  @IsMongoId()
  assignedStaffId?: string;

  @IsOptional()
  @IsMongoId()
  technicianId?: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  photosReceiving?: string[];
}
