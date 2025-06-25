import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { CreateRepairRequestDto } from './dtos/create.dto';
import { RepairRequestService } from './repairRequest.service';

@Controller('repair-requests')
export class RepairRequestController {
  constructor(private readonly service: RepairRequestService) {}

  @Post()
  async create(@Body() dto: CreateRepairRequestDto) {
    const data = await this.service.create(dto);
    return createResponse(201, data, ResponseMessage.CREATE);
  }

  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return createResponse(200, data, ResponseMessage.GET);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const data = await this.service.findById(id);
    return createResponse(200, data, ResponseMessage.GET);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const data = await this.service.updateStatus(id, status);
    return createResponse(200, data, ResponseMessage.UPDATE);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const data = await this.service.delete(id);
    return createResponse(200, data, ResponseMessage.DELETE);
  }
}
