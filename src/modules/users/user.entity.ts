import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type UserDocument = User & Document;
@Schema({timestamps: true, versionKey: false})
export class User{
    @Prop({ required: true, unique: true })
    phone: string;
  
    @Prop({ required: true })
    password: string;
  
    @Prop({ required: true })
    fullName: string;
  
    @Prop({ required: true, unique: true })
    email: string;
  
    @Prop()
    avatar: string;
  
    @Prop({ default: 1 })
    status: number;
}

export const UserSchema = SchemaFactory.createForClass(User);