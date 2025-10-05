import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type RepairServiceDocument = RepairService & Document;
@Schema({ timestamps: true, versionKey: false })
export class RepairService extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'RepairWarrantyPolicy', required: true })
  repairWarrantyPolicyId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'RepairServiceCategory', required: true })
  categoryId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Number, required: true })
  costPrice: number;

  @Prop({ type: Number, required: true })
  sellPrice: number;

  @Prop({ type: String, required: true })
  estimatedTime: string;

  @Prop({ type: Boolean, default: false })
  status: boolean;

  @Prop({ type: Number, required: true })
  stock: number;

  @Prop({ type: String, required: true })
  image: string;
}

export const RepairServiceSchema = SchemaFactory.createForClass(RepairService);
