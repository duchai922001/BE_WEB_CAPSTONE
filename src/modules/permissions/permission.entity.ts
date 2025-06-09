import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { UserPermission } from 'src/common/enums/permission';

export type PermissionDocument = Permission & Document;

@Schema({ timestamps: true, versionKey: false })
export class Permission extends Document {
  @Prop({ required: true, enum: UserPermission, unique: true })
  name: UserPermission;

  @Prop()
  description: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
