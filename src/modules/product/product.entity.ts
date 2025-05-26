import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ProductType } from 'src/common/enums/productType';
export type ProductDocument = Product & Document;
@Schema({ timestamps: true, versionKey: false })
export class Product extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Brand', required: true })
  brandId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: 0 })
  costPrice: number;

  @Prop({ default: 0 })
  sellPrice: number;

  @Prop({ default: 0 })
  stock: number;

  @Prop({ required: true, unique: true })
  barcode: string;

  @Prop({ default: false })
  status: boolean;

  @Prop({
    type: String,
    enum: ProductType,
    default: ProductType.NO_VARIABLE_NO_SERIAL,
  })
  typeProduct: ProductType;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
