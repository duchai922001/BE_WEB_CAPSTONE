import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './role.entity';
import { Model } from 'mongoose';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
  ) {}

  async findByName(name: string): Promise<Role | null> {
    return this.roleModel.findOne({ name }).exec();
  }

  async findById(id: string): Promise<Role | null> {
    return this.roleModel.findById(id).exec();
  }

  async create(data: Partial<Role>): Promise<Role> {
    return this.roleModel.create(data);
  }

  async findAll(): Promise<Role[]> {
    return this.roleModel.find().exec();
  }
}