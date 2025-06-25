import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export enum RepairRequestStatus {
  PENDING = 'PENDING', // Chờ xử lý
  ASSIGNED = 'ASSIGNED', // Đã giao kỹ thuật viên
  IN_PROGRESS = 'IN_PROGRESS', // Đang xử lý
  COMPLETED = 'COMPLETED', // Đã hoàn thành
  CANCELLED = 'CANCELLED', // Đã hủy
}
export type RepairRequestDocument = RepairRequest & Document;
@Schema({ timestamps: true, versionKey: false })
export class RepairRequest extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  assignedStaffId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  technicianId: Types.ObjectId;

  @Prop()
  deviceSerial: string;

  @Prop({ required: true })
  deviceName: string;

  @Prop({ required: true })
  issueDescription: string;

  @Prop()
  esstimatedCost: number;

  @Prop()
  actualCost: number;

  @Prop()
  completionDate: Date;

  @Prop()
  preferredDropoffDate: Date;

  @Prop()
  dropoffActualDate: Date;

  @Prop()
  pickupAppointmentDate: Date;

  @Prop()
  pickupActualDate: Date;

  @Prop()
  customerPaid: number;

  @Prop()
  customerDept: number;

  @Prop({ enum: RepairRequestStatus, default: RepairRequestStatus.PENDING })
  status: RepairRequestStatus;
}

export const RepairRequestSchema = SchemaFactory.createForClass(RepairRequest);
