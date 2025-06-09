import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type CartDocument = Cart & Document;
@Schema({ timestamps: true, versionKey: false })
export class Cart extends Document{
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ default: 1 })
  status: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
