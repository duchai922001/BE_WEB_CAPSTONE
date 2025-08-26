import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CartItemService } from './cartItem.service';
import { CreateCartItemDto } from './dtos/create-cartItem';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart-items')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Post('')
  async create(@Body() dto: CreateCartItemDto) {
    const data = await this.cartItemService.create(dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }
  @UseGuards(JwtAuthGuard)
  @Get('count')
  async getItemCount(@Request() req) {
    const data = await this.cartItemService.getItemCount(req.user?.userId);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get('')
  async findAll(@Query() query: BaseQueryDto) {
    const data = await this.cartItemService.findAll(query);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const data = await this.cartItemService.findById(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Delete('bulk')
  async deleteMany(@Body('ids') ids: string[]) {
    if (!ids || ids.length === 0) {
      return { message: 'Không có id nào được gửi lên' };
    }
    const data = await this.cartItemService.deleteMany(ids);
    return createResponse(HttpStatus.OK, data, ResponseMessage.DELETE_LIST);
  }

  @Patch(':id/quantity')
  async changeQuantity(@Param('id') id: string, @Body('delta') delta: number) {
    const data = await this.cartItemService.incrementQuantity(id, delta);
    return createResponse(HttpStatus.OK, data, ResponseMessage.UPDATE);
  }

  @Patch(':id/delete')
  async softDelete(@Param('id') id: string, @Body('delta') delta: number) {
    const data = await this.cartItemService.softDelete(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.DELETE);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const data = await this.cartItemService.delete(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.DELETE);
  }
}
