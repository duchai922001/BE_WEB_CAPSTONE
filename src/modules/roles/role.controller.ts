import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { createResponse } from 'src/common/helpers/response.helper';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/updated-role.dto';
import { isValidObjectId } from 'mongoose';
import { AddPermissionsDto } from './dtos/add-permission.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async create(@Body() dto: CreateRoleDto) {
    const data = await this.roleService.create(dto);
    return createResponse(HttpStatus.CREATED, data, 'Tạo role thành công');
  }

  @Get()
  async findAll() {
    const data = await this.roleService.findAll();
    return createResponse(HttpStatus.OK, data, 'Lấy danh sách role');
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const data = await this.roleService.findById(id);
    return createResponse(HttpStatus.OK, data, 'Lấy role thành công');
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    const data = await this.roleService.update(id, dto);
    return createResponse(HttpStatus.OK, data, 'Cập nhật role thành công');
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.roleService.delete(id);
    return createResponse(HttpStatus.OK, null, 'Xóa role thành công');
  }
  @Post(':id/permissions')
  async addPermissionsToRole(
    @Param('id') id: string,
    @Body() dto: AddPermissionsDto,
  ) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID role không hợp lệ');
    }

    return this.roleService.addPermissions(id, dto.permissionId);
  }
}
