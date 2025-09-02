import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './role.entity';
import { Model, Types } from 'mongoose';
import { UpdateRoleDto } from './dtos/updated-role.dto';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  async create(data: {
    name: string;
    description?: string;
    permissionId: Types.ObjectId[];
  }) {
    return this.roleModel.create(data);
  }

  async findAll(): Promise<RoleDocument[]> {
    return this.roleModel.find().exec();
  }

  async findByName(name: string): Promise<RoleDocument | null> {
    return this.roleModel.findOne({ name }).exec();
  }

  async findById(id: string): Promise<RoleDocument | null> {
    return this.roleModel.findById(id).exec();
  }

  async update(id: string, data: UpdateRoleDto): Promise<RoleDocument | null> {
    return this.roleModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.roleModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async addPermissionsToRole(
    roleId: string,
    permissionIds: string[],
  ): Promise<RoleDocument | null> {
    return this.roleModel.findByIdAndUpdate(
      roleId,
      { $addToSet: { permissionId: { $each: permissionIds } } }, // tránh trùng lặp
      { new: true },
    );
  }
  async getRoleConsultant() {
    return await this.roleModel.findOne({ name: 'CONSULTANT' }).exec();
  }
}
