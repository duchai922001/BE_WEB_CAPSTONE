import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { UserRole } from 'src/common/enums/role';

export type RoleDocument = Role & Document;

@Schema({ timestamps: true, versionKey: false })
export class Role {
  @Prop({ required: true, enum: UserRole, unique: true })
  name: UserRole;

  @Prop()
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Permission' }], default: [] })
  permissionId: Types.ObjectId[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
