import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
  IsBoolean,
  IsInt,
  Min,
} from 'class-validator';
import { WarrantyRequestStatus } from 'src/common/enums/warranty-request';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateWarrantyRequestDto {
  @IsNotEmpty()
  @IsString()
  orderItemId: string;

  @IsNotEmpty()
  createdBy: string;

  @IsNotEmpty()
  customerId: string;

  @IsNotEmpty()
  externalCondition: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  photosAtStore?: string[];

  @IsOptional()
  @IsDateString()
  receivedDate?: Date;
}
export class UpdateWarrantyRequestDto extends PartialType(
  CreateWarrantyRequestDto,
) {}

export class UpdateWarrantyStatusDto {
  @IsEnum(WarrantyRequestStatus)
  status: WarrantyRequestStatus;

  @IsOptional() @IsString() note?: string;
  @IsOptional() @IsDateString() expectedDate?: string;

  @IsOptional() @IsString() serviceCenterName?: string;
  @IsOptional() @IsString() brandTicketNo?: string;
  @IsOptional() @IsString() toBrandCarrier?: string;
  @IsOptional() @IsString() toBrandTrackingNo?: string;

  @IsOptional() @IsDateString() toBrandReceivedAt?: string;

  @IsOptional() @IsString() brandDiagnosis?: string;
  @IsOptional() @IsString() brandDecision?:
    | 'UNDER_WARRANTY'
    | 'OUT_OF_WARRANTY'
    | 'NO_FAULT_FOUND'
    | 'REJECTED';
  @IsOptional() @IsNumber() estimatedCost?: number;
  @IsOptional() @IsNumber() actualCost?: number;

  @IsOptional() @IsBoolean() customerApproved?: boolean;

  @IsOptional() @IsString() fromBrandCarrier?: string;
  @IsOptional() @IsString() fromBrandTrackingNo?: string;

  @IsOptional() @IsDateString() returnedDate?: string;
  @IsOptional() @IsDateString() deliveredAt?: string;
}

export class GetWarrantyRequestsDto {
  @IsOptional()
  @IsEnum(WarrantyRequestStatus)
  status?: WarrantyRequestStatus;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit = 20;

  @IsOptional()
  @IsString()
  sort?: 'desc' | 'asc';
}
