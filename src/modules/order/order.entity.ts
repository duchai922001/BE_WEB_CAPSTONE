import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { OrderNormalStatus } from 'src/common/enums/orderStatus';
import { PaymentMethod, PaymentType } from 'src/common/enums/payment';
import { ShippingProvider } from 'src/common/enums/shipping-provider';

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

  @Prop({ type: Types.ObjectId, ref: 'Address', required: true })
  addressId: Types.ObjectId;

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

  @Prop({
    enum: PaymentType,
    default: PaymentType.FULL_DEPOSIT,
  })
  paymentType: PaymentType;

  @Prop({
    enum: PaymentMethod,
    required: true,
  })
  paymentMethod: PaymentMethod;

  @Prop({ type: Date, required: false })
  depositDeadline?: Date;

  @Prop({
    enum: ShippingProvider,
    default: ShippingProvider.GHN,
  })
  shippingProvider?: ShippingProvider;

  @Prop({ type: String, required: false })
  trackingCode?: string;

  @Prop({ type: Number, required: false })
  feeShip?: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
