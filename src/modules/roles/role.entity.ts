import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { RoleSystem } from 'src/common/enums/role';

export type RoleDocument = Role & Document;

@Schema({ timestamps: true, versionKey: false })
export class Role {
  @Prop({ required: true, enum: RoleSystem, unique: true })
  name: RoleSystem;

  @Prop()
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Permission' }], default: [] })
  permissionId: Types.ObjectId[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
