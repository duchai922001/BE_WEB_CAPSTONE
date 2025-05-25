import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type VariableDocument = Variable & Document & { _id: Types.ObjectId };
@Schema({ timestamps: true, versionKey: false })
export class Variable extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  costPrice: number;

  @Prop({ default: 0 })
  sellPrice: number;

  @Prop({ default: 0 })
  stock: number;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: false, default: false })
  status: boolean;
}

export const VariableSchema = SchemaFactory.createForClass(Variable);
