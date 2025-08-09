import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type RepairRequestImageDocument = RepairRequestImage & Document;
export enum RepairImageType {
  BEFORE = 'before',
  AFTER = 'after',
}
@Schema({ timestamps: true, versionKey: false })
export class RepairRequestImage extends Document {
  @Prop({ type: Types.ObjectId, ref: 'RepairRequest', required: true })
  repairRequestId: Types.ObjectId;

  @Prop({ required: true })
  url: string;

  @Prop()
  note: string;

  @Prop({ type: String, enum: RepairImageType, required: true })
  type: RepairImageType;

  @Prop({ default: false })
  status: boolean;
}

export const RepairRequestImageSchema =
  SchemaFactory.createForClass(RepairRequestImage);
