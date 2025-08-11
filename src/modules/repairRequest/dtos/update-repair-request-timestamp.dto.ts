import { IsMongoId, IsIn, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateRepairRequestTimestampDto {
  @IsMongoId()
  repairRequestId: string;

  @IsIn([
    'dropoffActualDate',
    'processingDate',
    'pickupAppointmentDate',
    'completionDate',
    'cancelledDate',
    'customerConfirm',
  ])
  field: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  customerDebt: number;
}
