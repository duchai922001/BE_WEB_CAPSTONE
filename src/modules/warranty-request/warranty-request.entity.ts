import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { WarrantyRequestStatus } from 'src/common/enums/warranty-request';
export type WarrantyRequestDocument = WarrantyRequest & Document;
@Schema({ timestamps: true, versionKey: false })
export class WarrantyRequest extends Document {
  @Prop({ type: Types.ObjectId, ref: 'OrderItem', required: true })
  orderItemId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  customerId: string;

  @Prop()
  receivedDate: Date;

  @Prop()
  returnedDate: Date;

  @Prop({
    required: true,
    enum: WarrantyRequestStatus,
    default: WarrantyRequestStatus.RECEIVE,
  })
  status: WarrantyRequestStatus;
}

export const WarrantyRequestSchema =
  SchemaFactory.createForClass(WarrantyRequest);
