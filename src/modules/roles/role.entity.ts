import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserRole } from "src/common/enums/role";

export type RoleDocument = Role & Document;

@Schema({ timestamps: true, versionKey: false })
export class Role {
  @Prop({ required: true, enum: UserRole, unique: true })
  name: UserRole;

  @Prop()
  description: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);