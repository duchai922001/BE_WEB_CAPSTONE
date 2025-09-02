import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RepairWarrantyHistoryStatus } from 'src/common/enums/repair-warranty-history';

export type RepairWarrantyHistoryDocument = RepairWarrantyHistory & Document;

@Schema({ timestamps: true, versionKey: false })
export class RepairWarrantyHistory extends Document {
  @Prop({ type: Types.ObjectId, ref: 'RepairRequest', required: true })
  repairRequestId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'RepairInvoiceItem' })
  repairInvoiceItemId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedStaffId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  technicianId: Types.ObjectId;

  @Prop({
    required: true,
    enum: RepairWarrantyHistoryStatus,
    default: RepairWarrantyHistoryStatus.RECEIVED,
  })
  status: RepairWarrantyHistoryStatus;

  @Prop({ type: Number, default: 1 })
  countWarranty: number;

  @Prop()
  reason: string;

  @Prop()
  diagnosis: string;

  @Prop({ type: [String], default: [] })
  photosBefore: string[];

  @Prop({ type: [String], default: [] })
  photosAfter: string[];
}

export const RepairWarrantyHistorySchema = SchemaFactory.createForClass(
  RepairWarrantyHistory,
);
