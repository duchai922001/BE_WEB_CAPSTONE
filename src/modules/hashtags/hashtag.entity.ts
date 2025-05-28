import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type HashTagDocument = HashTag & Document;
@Schema({ timestamps: true, versionKey: false })
export class HashTag extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: false })
  isActive: boolean;
}

export const HashTagSchema = SchemaFactory.createForClass(HashTag);
