import { Controller, Post, Get, Param, Body, HttpStatus } from '@nestjs/common';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { RepairRequestImageService } from './repairRequestImage.service';
import { CreateRepairRequestImageDto } from './dtos/create.dto';

@Controller('repair-request-image')
export class RepairRequestImageController {
  constructor(private readonly service: RepairRequestImageService) {}

  @Post()
  async create(@Body() dto: CreateRepairRequestImageDto) {
    const data = await this.service.create(dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const data = await this.service.findById(id);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.GET);
  }
}
