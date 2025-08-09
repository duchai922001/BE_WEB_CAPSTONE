import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type SpecificationsKeyDocument = SpecificationsKey & Document;
@Schema({ timestamps: true, versionKey: false })
export class SpecificationsKey extends Document {
  @Prop({ required: true })
  key: string;

  @Prop({ default: false })
  isFilter: boolean;
}

export const SpecificationsKeySchema =
  SchemaFactory.createForClass(SpecificationsKey);
