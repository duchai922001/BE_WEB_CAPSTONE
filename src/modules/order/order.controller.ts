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
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CustomerCreateOrderDto } from './dtos/customer-create-order.dto';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('search')
  async searchByOrderCode(@Query('orderCode') orderCode: string) {
    const data = await this.orderService.searchOrderByOrderCode(orderCode);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Post('')
  async create(@Body() dto: CustomerCreateOrderDto) {
    const data = await this.orderService.createOrder(dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get('')
  async getAll(@Query() query: BaseQueryDto) {
    const data = await this.orderService.findAll(query);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get('getById/:id')
  async getById(@Param('id') id: string) {
    const data = await this.orderService.findById(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    const data = await this.orderService.update(id, dto);
    return createResponse(HttpStatus.OK, data, ResponseMessage.UPDATE);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const data = await this.orderService.delete(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.DELETE);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getByUserId(@Request() req) {
    const data = await this.orderService.getByUserId(req.user.userId);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get('get-user/:orderId')
  async getUserByOrderId(@Param('orderId') orderId: string){
    const data = await this.orderService.getUserByOrderId(orderId);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }
}
