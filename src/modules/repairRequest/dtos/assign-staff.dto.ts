import { IsOptional, IsMongoId } from 'class-validator';

export class AssignRepairRequestDto {
  @IsOptional()
  @IsMongoId()
  assignedStaffId?: string;

  @IsOptional()
  @IsMongoId()
  technicianId?: string;
}
