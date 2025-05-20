import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepo: RoleRepository) {}

  async getAll(): Promise<Role[]> {
    return this.roleRepo.findAll();
  }

  async getByName(name: string): Promise<Role | null> {
    return this.roleRepo.findByName(name);
  }

  async getById(id: string): Promise<Role | null> {
    return this.roleRepo.findById(id);
  }

  async createRole(data: Partial<Role>): Promise<Role> {
    return this.roleRepo.create(data);
  }
}