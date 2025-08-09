import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RepairWarrantyPolicyDocument = RepairWarrantyPolicy & Document;

@Schema({ timestamps: true, versionKey: false })
export class RepairWarrantyPolicy extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  duration: string;

  @Prop({ type: String, required: true })
  description: string;
}

export const RepairWarrantyPolicySchema =
  SchemaFactory.createForClass(RepairWarrantyPolicy);
