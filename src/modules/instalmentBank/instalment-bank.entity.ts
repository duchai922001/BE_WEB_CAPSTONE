import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InstalmentBankDocument = InstalmentBank & Document;

@Schema({ timestamps: true, versionKey: false })
export class InstalmentBank {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  logo: string;
  @Prop({ required: true })
  interestRate: number;

  @Prop({ required: true })
  term: number;
}

export const InstalmentBankSchema =
  SchemaFactory.createForClass(InstalmentBank);
