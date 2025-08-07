import { Injectable } from '@nestjs/common';
import { SpecificationsRepository } from './specifications.repository';
import {
  CreateSpecificationDto,
  UpdateSpecificationDto,
} from './dto/specifications.dto';

@Injectable()
export class SpecificationsService {
  constructor(private readonly repo: SpecificationsRepository) {}

  createBulk(data: CreateSpecificationDto[]) {
    return this.repo.createBulk(data);
  }

  getAll() {
    return this.repo.getAll();
  }

  getById(id: string) {
    return this.repo.getById(id);
  }

  update(id: string, data: UpdateSpecificationDto) {
    return this.repo.update(id, data);
  }

  findByProductId(productId: string) {
    return this.repo.findByProductId(productId);
  }

  async getFilterableSpecifications() {
    return this.repo.getFilterableSpecifications();
  }

  async getFilteredProductIds(
    productIds: string[],
    filters: Record<string, string[]>,
  ) {
    return this.repo.findMatchedProductIdsBySpecifications(productIds, filters);
  }
}
