import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
  provinces: string;

  @Prop({ required: true })
  districts: string;

  @Prop({ required: true })
  wards: string;

  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ default: false })
  isDefault: boolean;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
