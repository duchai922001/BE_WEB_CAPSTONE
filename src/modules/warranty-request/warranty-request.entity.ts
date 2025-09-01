import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { WarrantyRequestStatus } from 'src/common/enums/warranty-request';

export type WarrantyRequestDocument = WarrantyRequest & Document;

@Schema({ timestamps: true, versionKey: false })
export class WarrantyRequest extends Document {
  @Prop({ type: Types.ObjectId, ref: 'OrderItem', required: true })
  orderItemId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  customerId: Types.ObjectId;

  @Prop() receivedDate: Date;
  @Prop() externalCondition?: string;
  @Prop({ type: [String], default: [] }) photosAtStore?: string[];

  @Prop() serviceCenterName?: string;
  @Prop() brandTicketNo?: string;

  @Prop() toBrandCarrier?: string;
  @Prop() toBrandTrackingNo?: string;
  @Prop() toBrandShippedAt?: Date;
  @Prop() toBrandReceivedAt?: Date;

  @Prop() fromBrandCarrier?: string;
  @Prop() fromBrandTrackingNo?: string;
  @Prop() fromBrandShippedAt?: Date;
  @Prop() fromBrandReceivedAt?: Date;

  @Prop() brandDiagnosis?: string;
  @Prop({
    enum: ['UNDER_WARRANTY', 'OUT_OF_WARRANTY', 'NO_FAULT_FOUND', 'REJECTED'],
    default: 'UNDER_WARRANTY',
  })
  brandDecision?:
    | 'UNDER_WARRANTY'
    | 'OUT_OF_WARRANTY'
    | 'NO_FAULT_FOUND'
    | 'REJECTED';
  @Prop({ type: Number, default: 0 }) estimatedCost?: number;
  @Prop({ type: Number, default: 0 }) actualCost?: number;

  @Prop({ default: false }) customerApproved?: boolean;
  @Prop() customerApprovedAt?: Date;
  @Prop() approvalNote?: string;

  @Prop() returnedDate: Date;
  @Prop() deliveredAt?: Date;
  @Prop() expectedDate?: Date;

  @Prop({ type: [String], default: [] }) attachments?: string[];

  @Prop({
    required: true,
    enum: WarrantyRequestStatus,
    default: WarrantyRequestStatus.RECEIVE,
  })
  status: WarrantyRequestStatus;
}

export const WarrantyRequestSchema =
  SchemaFactory.createForClass(WarrantyRequest);

WarrantyRequestSchema.index({ status: 1, createdAt: -1 });
WarrantyRequestSchema.index({ customerId: 1, createdAt: -1 });
WarrantyRequestSchema.index({ brandTicketNo: 1 });
WarrantyRequestSchema.index({ toBrandTrackingNo: 1, fromBrandTrackingNo: 1 });
