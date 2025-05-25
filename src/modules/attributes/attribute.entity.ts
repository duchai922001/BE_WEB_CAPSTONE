import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type AttributeDocument = Attribute & Document;
@Schema({ timestamps: true, versionKey: false })
export class Attribute extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Variable', required: true })
  variableId: Types.ObjectId;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  value: string;
}

export const AttributeSchema = SchemaFactory.createForClass(Attribute);
