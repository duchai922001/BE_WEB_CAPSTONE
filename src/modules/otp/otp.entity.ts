import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OtpType } from 'src/common/enums/otp';

export type OtpDocument = Otp & Document<Types.ObjectId>;

@Schema({ timestamps: true, versionKey: false })
export class Otp {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true, enum: OtpType })
  purpose: OtpType;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  isUsed: boolean;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);