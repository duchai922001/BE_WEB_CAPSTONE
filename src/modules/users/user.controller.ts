import { Body, Controller, Get, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create.dto';
import { createResponse } from 'src/common/helpers/response.helper';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('')
  async create(@Body() dto: CreateUserDto) {
    const data = await this.userService.create(dto);
    return createResponse(HttpStatus.CREATED, data, 'Tạo user thành công');
  }
  @Get()
  async getAll(@Query() query: BaseQueryDto) {
    const data = await this.userService.getAll(query);
    return createResponse(HttpStatus.OK, data, 'Lấy danh sách User thành công');
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const user = await this.userService.getById(id);
    return createResponse(HttpStatus.OK, user, 'Lấy người dùng thành công');
  }

  @Post('auth')
  async validateUser(@Body() body: { phone: string; password: string}){
    const data = await this.userService.validateUser(body.phone, body.password);
    return createResponse(HttpStatus.OK, data, 'Đăng nhập thành công');
  }
}
