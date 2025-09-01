import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsDateString,
} from 'class-validator';
import { RepairWarrantyHistoryStatus } from 'src/common/enums/repair-warranty-history';

export class CreateRepairWarrantyHistoryDto {
  @IsMongoId()
  repairRequestId: string;

  @IsOptional()
  @IsMongoId()
  repairInvoiceItemId?: string;

  @IsOptional()
  @IsMongoId()
  technicianId?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsArray()
  photosBefore?: string[];
}

export class UpdateRepairWarrantyHistoryDto extends PartialType(
  CreateRepairWarrantyHistoryDto,
) {}

export class UpdateStatusDto {
  @IsEnum(RepairWarrantyHistoryStatus)
  status: RepairWarrantyHistoryStatus;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class UpdatePhotosDto {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  photosBefore?: string[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  photosAfter?: string[];
}

export class QueryRepairWarrantyHistoryDto {
  @IsOptional()
  @IsMongoId()
  repairRequestId?: string;

  @IsOptional()
  @IsEnum(RepairWarrantyHistoryStatus)
  status?: RepairWarrantyHistoryStatus;

  // lọc theo khoảng thời gian tạo bản ghi
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  // phân trang
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
