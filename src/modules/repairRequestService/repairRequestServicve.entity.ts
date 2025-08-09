import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type RepairRequestServiceDocument = RepairRequestService & Document;

@Schema({ timestamps: true, versionKey: false })
export class RepairRequestService extends Document {
  @Prop({ type: Types.ObjectId, ref: 'RepairRequest', required: true })
  repairRequestId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'RepairService' })
  RepairServiceId: Types.ObjectId;

  @Prop({ type: String })
  note: string;
}
export const RepairRequestServiceSchema = SchemaFactory.createForClass(RepairRequestService);
