import { Injectable, NotFoundException } from "@nestjs/common";
import { PermissionRepository } from "./permission.repository";
import { CreatePermissionDto } from "./dtos/create-permisson.dto";
import { UpdatePermissionDto } from "./dtos/update-permission.dto";

@Injectable()
export class PermissionService {
  constructor(private readonly permisRepo: PermissionRepository) {}

  async create(dto: CreatePermissionDto) {
    return this.permisRepo.create(dto);
  }

  async findAll() {
    return this.permisRepo.findAll();
  }

  async findByName(name: string) {
    return this.permisRepo.findByName(name);
  }

  async findById(id: string) {
    const role = await this.permisRepo.findById(id);
    if (!role) throw new NotFoundException('Không tìm thấy role');
    return role;
  }

  async update(id: string, dto: UpdatePermissionDto) {
    return this.permisRepo.update(id, dto);
  }

  async delete(id: string) {
    const ok = await this.permisRepo.delete(id);
    if (!ok) throw new NotFoundException('Không thể xóa role');
  }
}