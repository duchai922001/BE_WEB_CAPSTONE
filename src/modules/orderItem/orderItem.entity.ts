import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type OrderItemDocument = OrderItem & Document;
@Schema({ timestamps: true, versionKey: false })
export class OrderItem extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  orderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ default: 1 })
  quantity: number;
}
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
