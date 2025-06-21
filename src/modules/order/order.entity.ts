import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { OrderNormalStatus } from 'src/common/enums/orderStatus';

export type OrderDocument = Order & Document;
@Schema({ timestamps: true, versionKey: false })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Employee' })
  employeeId: Types.ObjectId;

  @Prop({ type: String, unique: true })
  orderCode: string;

  @Prop()
  discountType: string;

  @Prop()
  discountValue: string;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ default: 0 })
  estimatedRevenue: number;

  @Prop({ default: 0 })
  lastAmount: number;

  @Prop({ default: 0 })
  customerPaid: number;

  @Prop({ default: 0 })
  customerDept: number;

  @Prop({
    required: true,
    enum: OrderNormalStatus,
    default: OrderNormalStatus.PENDING,
  })
  status: string;

  @Prop({ default: false })
  isReturnedOrder: boolean;

  @Prop()
  reason: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
