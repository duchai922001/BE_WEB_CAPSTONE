import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Permission, PermissionDocument } from "./permission.entity";
import { Model } from "mongoose";
import { CreatePermissionDto } from "./dtos/create-permisson.dto";
import { UpdatePermissionDto } from "./dtos/update-permission.dto";

@Injectable()
export class PermissionRepository {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<PermissionDocument>,
  ) {}

  async create(data: CreatePermissionDto): Promise<PermissionDocument> {
    return new this.permissionModel(data).save();
  }

  async findAll(): Promise<PermissionDocument[]> {
    return this.permissionModel.find().exec();
  }

  async findByName(name: string): Promise<PermissionDocument | null> {
    return this.permissionModel.findOne({ name }).exec();
  }

  async findById(id: string): Promise<PermissionDocument | null> {
    return this.permissionModel.findById(id).exec();
  }

  async update(id: string, data: UpdatePermissionDto): Promise<PermissionDocument | null> {
    return this.permissionModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.permissionModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}