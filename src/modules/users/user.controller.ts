import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create.dto';
import { createResponse } from 'src/common/helpers/response.helper';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { UpdateUserDto } from './dtos/update.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  async create(@Body() dto: CreateUserDto) {
    const data = await this.userService.create(dto);
    return createResponse(HttpStatus.CREATED, data, 'Tạo user thành công');
  }
  @Get('')
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
  async validateUser(@Body() body: { phone: string; password: string }) {
    const data = await this.userService.validateUser(body.phone, body.password);
    return createResponse(HttpStatus.OK, data, 'Đăng nhập thành công');
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const updated = await this.userService.updateUser(id, dto);
    return createResponse(
      HttpStatus.OK,
      updated,
      'Cập nhật người dùng thành công',
    );
  }
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.userService.deleteUser(id);
    return { message: 'Xóa người dùng thành công' };
  }
}
