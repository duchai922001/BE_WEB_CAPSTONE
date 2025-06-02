import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateInstalmentRequestDto {
  @IsString()
  userId: string;

  @IsString()
  instalmentItemId: string;

  @IsString()
  assignedStaffId: string;

  @IsDateString()
  appointmentDate: Date;

  @IsString()
  @IsNotEmpty()
  bank: string;

  @IsString()
  @IsOptional()
  note?: string;
}
