import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RepairWarrantyPolicy,
  RepairWarrantyPolicyDocument,
} from './repair-warranty-policy.entity';
import {
  CreateRepairWarrantyPolicyDto,
  UpdateRepairWarrantyPolicyDto,
} from './repair-warranty-policy.dto';

@Injectable()
export class RepairWarrantyPolicyRepository {
  constructor(
    @InjectModel(RepairWarrantyPolicy.name)
    private readonly policyModel: Model<RepairWarrantyPolicyDocument>,
  ) {}

  async create(createDto: CreateRepairWarrantyPolicyDto) {
    const created = new this.policyModel(createDto);
    return created.save();
  }

  async findAll(): Promise<RepairWarrantyPolicy[]> {
    return this.policyModel.find().exec();
  }

  async findById(id: string) {
    return this.policyModel.findById(id).exec();
  }

  async update(id: string, updateDto: UpdateRepairWarrantyPolicyDto) {
    return this.policyModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
  }

  async delete(id: string) {
    return this.policyModel.findByIdAndDelete(id).exec();
  }
}
