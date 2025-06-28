import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { PermissionSystem } from 'src/common/enums/permission';
import { TableSystem } from 'src/common/enums/tableSystem';

export type PermissionDocument = Permission & Document;

@Schema({ timestamps: true, versionKey: false })
export class Permission extends Document {
  @Prop({ required: true, enum: PermissionSystem })
  name: PermissionSystem;

  @Prop({ required: true, enum: TableSystem })
  table: string;

  @Prop()
  description: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
