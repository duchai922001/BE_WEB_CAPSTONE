import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true, versionKey: false })
export class Notification extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  type: string;

  @Prop()
  targetUrl: string;
}
export const NotificationSchema = SchemaFactory.createForClass(Notification);
