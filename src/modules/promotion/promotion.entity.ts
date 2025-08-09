import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  PromotionDiscountType,
  PromotionStatus,
} from 'src/common/enums/promotion';
export type PromotionDocument = Promotion & Document;

@Schema({ timestamps: true, versionKey: false })
export class Promotion {
  @Prop({ type: [Types.ObjectId], ref: 'Product', default: [] })
  products: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 0 })
  discountValue: number;

  @Prop({ required: true, enum: PromotionDiscountType })
  discountType: string;

  @Prop({ required: true, index: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({
    type: String,
    enum: PromotionStatus,
    default: PromotionStatus.PENDING,
  })
  status: PromotionStatus;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
