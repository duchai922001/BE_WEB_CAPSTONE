import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type PromotionDocument = Promotion & Document;

@Schema({ timestamps: true, versionKey: false })
export class Promotion {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 0 })
  discountValue: number;

  @Prop({ required: true })
  discountType: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  createBy: string;

  @Prop({ required: false })
  mainImage: string;

  @Prop({ required: false })
  rightImage: string;

  @Prop({ required: false })
  LeftImage: string;

  @Prop({ type: [String], default: [] })
  listImage: string[];

  @Prop({ default: false })
  isDelete: boolean;

  @Prop({ type: [Types.ObjectId], ref: 'Product', default: [] })
  products: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  isSelectBy: Types.ObjectId;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
