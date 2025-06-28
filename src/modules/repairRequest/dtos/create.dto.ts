import {
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RepairRequestStatus } from '../repairRequest.entity';

export class CreateRepairRequestDto {
  @IsMongoId()
  userId: string;

  @IsMongoId()
  assignedStaffId: string;

  @IsMongoId()
  technicianId: string;

  @IsOptional()
  @IsString()
  deviceSerial?: string;

  @IsNotEmpty()
  @IsString()
  deviceName: string;

  @IsNotEmpty()
  @IsString()
  issueDescription: string;

  @IsOptional()
  @IsNumber()
  esstimatedCost?: number;

  @IsOptional()
  @IsNumber()
  actualCost?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  completionDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  preferredDropoffDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dropoffActualDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  pickupAppointmentDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  pickupActualDate?: Date;

  @IsOptional()
  @IsNumber()
  customerPaid?: number;

  @IsOptional()
  @IsNumber()
  customerDept?: number;

  @IsEnum(RepairRequestStatus)
  status: RepairRequestStatus;
}
