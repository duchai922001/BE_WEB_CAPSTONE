import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InstalmentBankDocument = InstalmentBank & Document;

@Schema({ timestamps: true, versionKey: false })
export class InstalmentBank {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  logo: string; // URL ảnh logo

  @Prop({ required: true })
  interestRate: number; // ví dụ 0.012 (1.2%)

  @Prop({ required: true })
  term: number; // số tháng: 6, 9, 12
}

export const InstalmentBankSchema =
  SchemaFactory.createForClass(InstalmentBank);
