import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import e from 'express';
import { Document, Types } from 'mongoose';
export type AddressDocument = Address & Document;

@Schema({ timestamps: true, versionKey: false })
export class Address extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop()
  receiverName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  fullAddress: string;

  @Prop({ default: false })
  isDefault: boolean;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
