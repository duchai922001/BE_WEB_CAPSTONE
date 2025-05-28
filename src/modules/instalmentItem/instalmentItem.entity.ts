import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type InstalmentItemDocument = InstalmentItem & Document;

@Schema({ timestamps: true, versionKey: false })
export class InstalmentItem {
  @Prop({ type: Types.ObjectId, ref: 'InstalmentCart', required: true })
  InstalmentCartId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ default: false })
  status: boolean;
}

export const InstalmentItemSchema =
  SchemaFactory.createForClass(InstalmentItem);
