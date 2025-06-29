import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateOrderItemDto } from './dtos/create-orderItem.dto';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { OrderItemService } from './orderItem.service';

@Controller('order-items')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post('')
  async create(@Body() dto: CreateOrderItemDto) {
    const data = await this.orderItemService.create(dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get('')
  async findAll(@Query() query: BaseQueryDto) {
    const data = await this.orderItemService.findAll(query);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const data = await this.orderItemService.findById(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const data = await this.orderItemService.delete(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.DELETE);
  }

  @Get('order/:orderId')
  async findByOrderId(@Param('orderId') orderId: string) {
    const data = await this.orderItemService.getByOrderId(orderId);

    if (!data || data.length === 0) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        ResponseMessage.FILE_NOT_FOUND,
      );
    }
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }
}
