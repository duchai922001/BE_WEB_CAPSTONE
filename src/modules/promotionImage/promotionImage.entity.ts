import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PromotionImageType } from 'src/common/enums/promotionImage';

export type PromotionImageDocument = PromotionImage & Document;

@Schema({ timestamps: true, versionKey: false })
export class PromotionImage extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Promotion', required: true })
  promotionId: Types.ObjectId;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true, enum: PromotionImageType })
  type: string;
}
export const PromotionImageSchema =
  SchemaFactory.createForClass(PromotionImage);
