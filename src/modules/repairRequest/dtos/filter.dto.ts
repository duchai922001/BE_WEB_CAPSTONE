import { IsArray, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { RepairRequestStatus } from 'src/common/enums/repairRequestStatus';

export class FilterRepairRequestDto {
  @IsOptional()
  @IsArray()
  @IsEnum(RepairRequestStatus, { each: true })
  statuses?: RepairRequestStatus[];

  @IsOptional()
  @IsDateString()
  fromDate?: string; // dùng string cho ISO date format

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
