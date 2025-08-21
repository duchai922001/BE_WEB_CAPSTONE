import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductWarrantyPolicyRepository } from './product-warranty-policy.repository';
import {
  CreateProductWarrantyPolicyDto,
  UpdateProductWarrantyPolicyDto,
} from './product-warranty-policy.dto';

@Injectable()
export class ProductWarrantyPolicyService {
  constructor(private readonly policyRepo: ProductWarrantyPolicyRepository) {}

  async create(dto: CreateProductWarrantyPolicyDto) {
    return this.policyRepo.create(dto);
  }

  async findAll() {
    return this.policyRepo.findAll();
  }

  async findOne(id: string) {
    const policy = await this.policyRepo.findById(id);
    if (!policy) throw new NotFoundException(`Policy ${id} not found`);
    return policy;
  }

  async update(id: string, dto: UpdateProductWarrantyPolicyDto) {
    const updated = await this.policyRepo.update(id, dto);
    if (!updated) throw new NotFoundException(`Policy ${id} not found`);
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.policyRepo.delete(id);
    if (!deleted) throw new NotFoundException(`Policy ${id} not found`);
    return deleted;
  }
}
