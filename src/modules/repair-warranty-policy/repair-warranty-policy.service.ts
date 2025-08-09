import { Injectable, NotFoundException } from '@nestjs/common';
import { RepairWarrantyPolicyRepository } from './repair-warranty-policy.repository';
import {
  CreateRepairWarrantyPolicyDto,
  UpdateRepairWarrantyPolicyDto,
} from './repair-warranty-policy.dto';

@Injectable()
export class RepairWarrantyPolicyService {
  constructor(private readonly policyRepo: RepairWarrantyPolicyRepository) {}

  async create(dto: CreateRepairWarrantyPolicyDto) {
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

  async update(id: string, dto: UpdateRepairWarrantyPolicyDto) {
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
