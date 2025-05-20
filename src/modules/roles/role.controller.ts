import { Controller, Get, Post, Body } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  getAllRoles() {
    return this.roleService.getAll();
  }

  @Post()
  createRole(@Body() body: { name: string; description?: string }) {
    return this.roleService.createRole(body);
  }
}