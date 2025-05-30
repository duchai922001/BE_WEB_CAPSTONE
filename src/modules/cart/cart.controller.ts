import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CreateCartDto } from './dtos/create-cart.dto';
import { CartService } from './cart.service';
import { createResponse } from 'src/common/helpers/response.helper';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Post()
  async create(@Body() dto: CreateCartDto) {
    const data = await this.cartService.create(dto);
    return createResponse(HttpStatus.CREATED, data, 'Tạo cart thành công');
  }
  @Get()
  async findAll() {
    const data = await this.cartService.findAll();
    return createResponse(HttpStatus.OK, data, 'Lấy danh sách cart thành công');
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const data = await this.cartService.findById(id);
    return createResponse(HttpStatus.OK, data, ' Lấy cart thành công');
  }

  @Delete('id')
  async delete(@Param('id') id: string) {
    await this.cartService.delete(id);
    return createResponse(HttpStatus.OK, null, 'Xoá cart thành công');
  }
}
