import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;
@Schema({ timestamps: true, versionKey: false })
export class User extends Document {
  @Prop({ sparse: true })
  phone: string;

  @Prop({ default: null })
  password: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ default: null })
  email: string;

  @Prop({ type: Types.ObjectId, ref: 'Role', required: true })
  roleId: Types.ObjectId;

  @Prop()
  avatar: string;

  @Prop({ default: 1 })
  status: number;

  @Prop({ default: null, unique: true, sparse: true })
  googleId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});
