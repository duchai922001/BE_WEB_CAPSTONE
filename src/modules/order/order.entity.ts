import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type OrderDocument = Order & Document;
@Schema({ timestamps: true, versionKey: false })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Employee'})
  employeeId: Types.ObjectId;

  @Prop()
  discountType: string;

  @Prop()
  discountValue: string;

  @Prop({required: true})
  totalAmount: number;

  @Prop({default: 0})
  estimatedRevenue: number;

  @Prop({required: true})
  lastAmount: number;

  @Prop({required: true})
  customerPaid: number;

  @Prop({default: 0})
  customerDept: number;

  @Prop({default: 1})
  status: number;

  @Prop({default: false})
  isReturnedOrder: boolean;

  @Prop()
  reason: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
