import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PaymentMethod } from 'src/common/enums/paymentMethod';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true, versionKey: false })
export class Payment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  orderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Repairrequest', default: '' })
  repairRequestId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: PaymentMethod })
  method: string;

  @Prop({ default: '' })
  transactionCode: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
