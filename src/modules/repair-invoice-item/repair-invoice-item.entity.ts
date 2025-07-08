import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RepairInvoiceItemDocument = RepairInvoiceItem & Document;

@Schema({ timestamps: true, versionKey: false })
export class RepairInvoiceItem extends Document {
  @Prop({ type: Types.ObjectId, ref: 'RepairRequest', required: true })
  repairRequestId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'RepairService' })
  repairServiceId: Types.ObjectId;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Number, required: true })
  laborCost: number;

  @Prop({ type: Number })
  totalPrice: number;

  @Prop({ default: '' })
  note: string;
}

export const RepairInvoiceItemSchema =
  SchemaFactory.createForClass(RepairInvoiceItem);
