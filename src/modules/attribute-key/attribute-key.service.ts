import { Injectable } from '@nestjs/common';
import { AttributeKeyRepository } from './attribute-key.repository';

@Injectable()
export class AttributeKeyService {
  constructor(private readonly repo: AttributeKeyRepository) {}

  create(name: string) {
    return this.repo.create(name);
  }

  findAll() {
    return this.repo.findAll();
  }

  findById(id: string) {
    return this.repo.findById(id);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
