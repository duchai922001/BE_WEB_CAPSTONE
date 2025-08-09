import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductWarrantyPolicyDocument = ProductWarrantyPolicy & Document;

@Schema({ timestamps: true, versionKey: false })
export class ProductWarrantyPolicy extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  duration: string;

  @Prop({ type: String, required: true })
  description: string;
}

export const ProductWarrantyPolicySchema = SchemaFactory.createForClass(
  ProductWarrantyPolicy,
);
