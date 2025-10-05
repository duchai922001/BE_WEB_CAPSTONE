import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RepairServiceCategoryDocument = RepairServiceCategory & Document;

@Schema({ timestamps: true, versionKey: false })
export class RepairServiceCategory extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  icon: string;

  @Prop({ required: false })
  url: string;

  @Prop({ default: 1 })
  slot: number;

  @Prop({ default: false })
  isDelete: boolean;
}

export const RepairServiceCategorySchema = SchemaFactory.createForClass(
  RepairServiceCategory,
);
