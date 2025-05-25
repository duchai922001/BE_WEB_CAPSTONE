import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/updated-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepo: RoleRepository) {}

  async create(dto: CreateRoleDto) {
    return this.roleRepo.create(dto);
  }

  async findAll() {
    return this.roleRepo.findAll();
  }

  async findByName(name: string) {
    return this.roleRepo.findByName(name);
  }

  async findById(id: string) {
    const role = await this.roleRepo.findById(id);
    if (!role) throw new NotFoundException('Không tìm thấy role');
    return role;
  }

  async update(id: string, dto: UpdateRoleDto) {
    return this.roleRepo.update(id, dto);
  }

  async delete(id: string) {
    const ok = await this.roleRepo.delete(id);
    if (!ok) throw new NotFoundException('Không thể xóa role');
  }
}
