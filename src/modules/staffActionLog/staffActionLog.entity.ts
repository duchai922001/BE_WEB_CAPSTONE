import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ActionTypeConfig, RefConfig } from '../../common/enums/config';
export type StaffActionLogDocument = StaffActionLog & Document;
@Schema({ timestamps: true, versionKey: false })
export class StaffActionLog extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  url: string;

  @Prop({ required: true })
  actionType: ActionTypeConfig;

  @Prop()
  description: string;
}

export const StaffActionLogSchema =
  SchemaFactory.createForClass(StaffActionLog);
