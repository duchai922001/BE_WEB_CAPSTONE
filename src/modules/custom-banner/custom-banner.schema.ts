import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomBannerDocument = CustomBanner & Document;

@Schema({ timestamps: true, versionKey: false })
export class CustomBanner extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  image: string;

  @Prop()
  description: string;

  @Prop()
  linkUrl: string;

  @Prop({ default: 1 })
  order: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDelete: boolean;
}

export const CustomBannerSchema = SchemaFactory.createForClass(CustomBanner);
