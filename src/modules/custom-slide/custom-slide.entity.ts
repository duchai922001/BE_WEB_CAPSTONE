import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomSlideDocument = CustomSlide & Document;

@Schema({ timestamps: true, versionKey: false })
export class CustomSlide extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: false })
  linkUrl: string;

  @Prop({ default: 1 })
  order: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDelete: boolean;
}

export const CustomSlideSchema = SchemaFactory.createForClass(CustomSlide);
