import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type InstalmentCartDocument = InstalmentCart & Document;

@Schema({ timestamps: true, versionKey: false })
export class InstalmentCart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ default: false })
  status: boolean;
}

export const InstalmentCartSchema =
  SchemaFactory.createForClass(InstalmentCart);
