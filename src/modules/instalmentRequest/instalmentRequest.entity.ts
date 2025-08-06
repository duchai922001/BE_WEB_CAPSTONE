import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { InstalmentRequestStatus } from 'src/common/enums/instalmentRequest';

export type InstalmentRequestDocument = InstalmentRequest & Document;

@Schema({ timestamps: true, versionKey: false })
export class InstalmentRequest {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'InstalmentItem', required: true })
  instalmentItemId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedStaffId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  appointmentDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'InstalmentBank', required: true })
  bankId: Types.ObjectId;

  @Prop({ type: String })
  note?: string;

  @Prop({
    type: String,
    enum: InstalmentRequestStatus,
    default: InstalmentRequestStatus.PENDING,
  })
  status: InstalmentRequestStatus;

  @Prop({ type: String, required: true })
  documentType: string;

  @Prop({ type: String, required: true })
  documentNumber: string;

  @Prop({ type: String, required: true })
  idFrontUrl: string;

  @Prop({ type: String, required: true })
  idBackUrl: string;

  @Prop({ type: String })
  insurance?: string;

  @Prop({ type: Number, required: true })
  income: number;

  @Prop({ type: String, required: true })
  occupation: string;

  @Prop({ type: String, required: true })
  fullName: string;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String, required: true })
  address: string;
}

export const InstalmentRequestSchema =
  SchemaFactory.createForClass(InstalmentRequest);
