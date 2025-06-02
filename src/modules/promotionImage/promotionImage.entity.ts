import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type PromotionImageDocument = PromotionImage & Document;

@Schema({ timestamps: true, versionKey: false })
export class PromotionImage extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Promotion', required: true })
  promotionId: Types.ObjectId;

  @Prop()
  url: string;

  @Prop()
  type: string;
}
export const PromotionImageSchema = SchemaFactory.createForClass(PromotionImage);
