import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RepairRequestStatus } from '../../common/enums/repairRequestStatus';

export type RepairRequestDocument = RepairRequest & Document;
@Schema({ timestamps: true, versionKey: false })
export class RepairRequest extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedStaffId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  technicianId: Types.ObjectId;

  @Prop({ type: String, unique: true })
  repairRequestCode: string;

  @Prop()
  deviceSerial: string;

  @Prop()
  customerName: string;

  @Prop()
  customerPhone: string;

  @Prop({ required: true })
  deviceName: string;

  @Prop({ required: true })
  issueDescription: string;

  @Prop({ default: 0 })
  estimatedCost: number;

  @Prop({ default: 0 })
  countWarranty: number;

  @Prop({ default: 0 })
  actualCost: number;

  @Prop() // Thời gian nhận hàng
  dropoffActualDate: Date;

  @Prop() // Thời gian xử lý
  processingDate: Date;

  @Prop() // Thời gian xử lý
  customerConfirmDate: Date;

  @Prop() // Thời gian dự kiến giao hàng
  pickupAppointmentDate: Date;

  @Prop() // Thời gian hoàn thành đơn
  completionDate: Date;

  @Prop() // Thời gian hủy đơn
  cancelledDate: Date;

  @Prop({ default: 0 })
  customerPaid: number;

  @Prop({ default: 0 })
  customerDept: number;

  @Prop({
    required: true,
    enum: RepairRequestStatus,
    default: RepairRequestStatus.PENDING,
  })
  status: RepairRequestStatus;
}

export const RepairRequestSchema = SchemaFactory.createForClass(RepairRequest);
