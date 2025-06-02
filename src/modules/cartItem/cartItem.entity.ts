import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type CartItemDocument = CartItem & Document;
@Schema({ timestamps: true, versionKey: false })
export class CartItem extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Cart', required: true })
  cartId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({default: 1})
  quantity: number;

  @Prop({default: false})
  isSelected: boolean;
}
export const CartItemSchema = SchemaFactory.createForClass(CartItem);
