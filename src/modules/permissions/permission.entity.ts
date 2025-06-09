import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { PermissionSystem } from 'src/common/enums/permission';

export type PermissionDocument = Permission & Document;

@Schema({ timestamps: true, versionKey: false })
export class Permission extends Document {
  @Prop({ required: true, enum: PermissionSystem, unique: true })
  name: PermissionSystem;

  @Prop()
  description: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
