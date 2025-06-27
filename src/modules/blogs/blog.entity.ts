import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type BlogDocument = Blog & Document;

export enum TypeBlog {
  TECHNOLOGY = 'TECHNOLOGY',
  GAME = 'GAME',
}
@Schema({ timestamps: true, versionKey: false })
export class Blog {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  thumbailImage: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  brieftContent: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  hashTag: string[];

  @Prop({ required: true, enum: TypeBlog })
  typeBlog: TypeBlog;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
