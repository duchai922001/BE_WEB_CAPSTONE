import { IsMongoId, IsIn } from 'class-validator';

export class UpdateRepairRequestTimestampDto {
  @IsMongoId()
  repairRequestId: string;

  @IsIn([
    'dropoffActualDate',
    'processingDate',
    'pickupAppointmentDate',
    'completionDate',
    'cancelledDate',
  ])
  field: string;
}
