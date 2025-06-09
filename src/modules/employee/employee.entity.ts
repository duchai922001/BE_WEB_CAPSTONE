import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type EmployeeDocument = Employee & Document;
@Schema({ timestamps: true, versionKey: false })
export class Employee {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ default: 1 })
  status: number;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
