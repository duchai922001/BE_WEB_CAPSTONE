import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AttributeKeyDocument = AttributeKey & Document;

@Schema({ timestamps: true, versionKey: false })
export class AttributeKey {
  @Prop({ required: true, unique: true })
  name: string;
}

export const AttributeKeySchema = SchemaFactory.createForClass(AttributeKey);
