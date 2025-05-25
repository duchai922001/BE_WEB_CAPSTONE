import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type SerialDocument = Serial & Document;
@Schema({ timestamps: true, versionKey: false })
export class Serial extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Variable' })
  variableId: Types.ObjectId;

  @Prop({ required: true })
  serialCode: boolean;

  @Prop()
  description: string;

  @Prop({ default: false })
  isSold: boolean;
}

export const SerialSchema = SchemaFactory.createForClass(Serial);
