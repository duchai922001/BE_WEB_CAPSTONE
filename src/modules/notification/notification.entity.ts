import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { NotificationType } from 'src/common/enums/notification-type';
export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true, versionKey: false })
export class Notification extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({
    type: String,
    enum: NotificationType,
    default: NotificationType.NOTI,
  })
  type: NotificationType;

  @Prop()
  targetUrl: string;

  @Prop({ default: false })
  isRead: boolean;
}
export const NotificationSchema = SchemaFactory.createForClass(Notification);
