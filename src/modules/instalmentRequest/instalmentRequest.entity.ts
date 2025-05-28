import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type InstalmentRequestDocument = InstalmentRequest & Document;

@Schema({ timestamps: true, versionKey: false })
export class InstalmentRequest {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'InstalmentItem', required: true })
  instalmentItemId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  assignedStaffId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  appointmentDate: Date;

  @Prop({ type: String, required: true })
  bank: string;

  @Prop({ type: String, required: false })
  note: string;

  @Prop({ default: false })
  status: boolean;
}

export const InstalmentRequestSchema =
  SchemaFactory.createForClass(InstalmentRequest);
