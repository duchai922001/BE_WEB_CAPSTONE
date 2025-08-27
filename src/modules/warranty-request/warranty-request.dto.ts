import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsString,
} from 'class-validator';
import { WarrantyRequestStatus } from 'src/common/enums/warranty-request';
import { PartialType } from '@nestjs/mapped-types';

export class CreateWarrantyRequestDto {
  @IsNotEmpty()
  @IsString()
  orderItemId: string;

  @IsNotEmpty()
  createdBy: string;

  @IsNotEmpty()
  customerId: string;

  @IsOptional()
  @IsDateString()
  receivedDate?: Date;

  @IsOptional()
  @IsDateString()
  returnedDate?: Date;

  @IsOptional()
  @IsEnum(WarrantyRequestStatus)
  status?: WarrantyRequestStatus;
}
export class UpdateWarrantyRequestDto extends PartialType(
  CreateWarrantyRequestDto,
) {}

export class UpdateWarrantyStatusDto {
  @IsNotEmpty()
  @IsEnum(WarrantyRequestStatus)
  status: WarrantyRequestStatus;
}
