import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type SpecificationsDocument = Specifications & Document;
@Schema({ timestamps: true, versionKey: false })
export class Specifications extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  key: string;

  @Prop()
  value: string;

  @Prop({ default: false })
  isFilter: boolean;
}

export const SpecificationsSchema =
  SchemaFactory.createForClass(Specifications);
