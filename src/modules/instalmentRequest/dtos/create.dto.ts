import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  IsMongoId,
} from 'class-validator';
import { InstalmentRequestStatus } from 'src/common/enums/instalmentRequest';

export class CreateInstalmentRequestDto {
  @IsMongoId()
  productId: string;

  @IsMongoId()
  @IsOptional()
  variableId?: string;

  @IsDateString()
  appointmentDate: Date;

  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsNumber()
  @IsNotEmpty()
  installmentPeriod: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsString()
  @IsNotEmpty()
  documentType: 'cccd' | 'license';

  @IsString()
  @IsNotEmpty()
  documentNumber: string;

  @IsOptional()
  @IsString()
  insurance?: string;

  @IsNumber()
  income: number;

  @IsString()
  @IsNotEmpty()
  occupation: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  idFrontUrl: string;

  @IsString()
  @IsNotEmpty()
  idBackUrl: string;

  @IsOptional()
  @IsEnum(InstalmentRequestStatus)
  status?: InstalmentRequestStatus;
}
