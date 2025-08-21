import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProductWarrantyPolicy,
  ProductWarrantyPolicyDocument,
} from './product-warranty-policy.entity';
import {
  CreateProductWarrantyPolicyDto,
  UpdateProductWarrantyPolicyDto,
} from './product-warranty-policy.dto';

@Injectable()
export class ProductWarrantyPolicyRepository {
  constructor(
    @InjectModel(ProductWarrantyPolicy.name)
    private readonly policyModel: Model<ProductWarrantyPolicyDocument>,
  ) {}

  async create(createDto: CreateProductWarrantyPolicyDto) {
    const created = new this.policyModel(createDto);
    return created.save();
  }

  async findAll(): Promise<ProductWarrantyPolicy[]> {
    return this.policyModel.find().exec();
  }

  async findById(id: string) {
    return this.policyModel.findById(id).exec();
  }

  async update(id: string, updateDto: UpdateProductWarrantyPolicyDto) {
    return this.policyModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
  }

  async delete(id: string) {
    return this.policyModel.findByIdAndDelete(id).exec();
  }
}
