import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RepairInvoiceItemService } from './repair-invoice-item.service';
import { CreateRepairInvoiceItemDto } from './dtos/create-repair-invoice-item.dto';
import { UpdateRepairInvoiceItemDto } from './dtos/update-repair-invoice-item.dto';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';

@Controller('repair-invoice-items')
export class RepairInvoiceItemController {
  constructor(private readonly service: RepairInvoiceItemService) {}

  @Post()
  async create(@Body() dto: CreateRepairInvoiceItemDto) {
    const data = await this.service.create(dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.service.findOne(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRepairInvoiceItemDto,
  ) {
    const data = await this.service.update(id, dto);
    return createResponse(HttpStatus.OK, data, ResponseMessage.UPDATE);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const data = await this.service.delete(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.DELETE);
  }

  @Get('/by-repair-request/:repairRequestId')
  async findByRepairRequestId(
    @Param('repairRequestId') repairRequestId: string,
  ) {
    const data = await this.service.findByRepairRequestId(repairRequestId);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }
}
