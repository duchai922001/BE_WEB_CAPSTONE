import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { createResponse } from "src/common/helpers/response.helper";
import { PermissionService } from "./permission.service";
import { CreatePermissionDto } from "./dtos/create-permisson.dto";
import { UpdatePermissionDto } from "./dtos/update-permission.dto";

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async create(@Body() dto: CreatePermissionDto) {
    const data = await this.permissionService.create(dto);
    return createResponse(HttpStatus.CREATED, data, 'Tạo Permission thành công');
  }

  @Get()
  async findAll() {
    const data = await this.permissionService.findAll();
    return createResponse(HttpStatus.OK, data, 'Lấy danh sách Permission');
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const data = await this.permissionService.findById(id);
    return createResponse(HttpStatus.OK, data, 'Lấy Permission thành công');
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
    const data = await this.permissionService.update(id, dto);
    return createResponse(HttpStatus.OK, data, 'Cập nhật Permission thành công');
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.permissionService.delete(id);
    return createResponse(HttpStatus.OK, null, 'Xóa Permission thành công');
  }
}