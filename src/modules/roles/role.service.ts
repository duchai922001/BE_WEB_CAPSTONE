import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/updated-role.dto';
import { isValidObjectId, Types } from 'mongoose';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepo: RoleRepository) {}

  async create(dto: CreateRoleDto) {
    const transformedData = {
      ...dto,
      permissionId: dto.permissionId.map((id) => new Types.ObjectId(id)),
    };
    return this.roleRepo.create(transformedData);
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

  async addPermissions(roleId: string, newPermissionIds: string[]) {
    if (!isValidObjectId(roleId)) {
      throw new BadRequestException('ID role không hợp lệ');
    }

    // Optionally validate permission ids trước khi thêm
    for (const permissionId of newPermissionIds) {
      if (!isValidObjectId(permissionId)) {
        throw new BadRequestException(
          `Permission ID không hợp lệ: ${permissionId}`,
        );
      }
    }

    const role = await this.roleRepo.findById(roleId);
    if (!role) {
      throw new NotFoundException('Role không tồn tại');
    }

    return this.roleRepo.addPermissionsToRole(roleId, newPermissionIds);
  }
}
