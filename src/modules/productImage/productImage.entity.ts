import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type ProductImageDocument = ProductImage & Document;
@Schema({ timestamps: true, versionKey: false })
export class ProductImage extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  url: string;

  @Prop({ default: false })
  isDefault: boolean;
}

export const ProductImageSchema = SchemaFactory.createForClass(ProductImage);
