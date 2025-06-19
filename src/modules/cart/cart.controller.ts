import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateCartDto } from './dtos/create-cart.dto';
import { CartService } from './cart.service';
import { createResponse } from 'src/common/helpers/response.helper';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddToCartDto } from './dtos/add-product-cart.dto';
import { ResponseMessage } from 'src/common/enums/responseMessage';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Post()
  async create(@Body() dto: CreateCartDto) {
    const data = await this.cartService.create(dto);
    return createResponse(HttpStatus.CREATED, data, 'Tạo cart thành công');
  }

  @Post('add-product')
  async addToCart(@Body() body: AddToCartDto, @Request() req) {
    const data = await this.cartService.addToCart(
      req.user.userId,
      body.productId,
      body.quantity,
    );
    return createResponse(HttpStatus.OK, data, ResponseMessage.CREATE);
  }

  @Get('items')
  async getCartItems(@Request() req) {
    const data = await this.cartService.getCartItems(req.user.userId);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get('instalment-items')
  async getInstalmentItems(@Request() req) {
    const data = await this.cartService.getInstalmentItems(req.user.userId);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
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

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.cartService.delete(id);
    return createResponse(HttpStatus.OK, null, 'Xoá cart thành công');
  }
}
