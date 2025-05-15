import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type ProductDocument = Product & Document;
@Schema({ timestamps: true, versionKey: false })
export class Product {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: 0 })
  costPrice: number;

  @Prop({ default: 0 })
  sellPrice: number;

  @Prop({ default: 0 })
  stock: number;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Brand', required: true })
  brandId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Variable', default: [] })
  variables: Types.ObjectId[];

  @Prop({ required: false })
  mainImage: string;

  @Prop({ type: [String], default: [] })
  listImage: string[];

  @Prop({ type: [String], default: [] })
  serials: string[];

  @Prop({ default: false })
  isSerial: boolean;

  @Prop({ default: false })
  isDelete: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
