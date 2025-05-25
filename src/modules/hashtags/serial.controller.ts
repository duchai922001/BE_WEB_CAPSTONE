import { Controller, Post, Get, Param, Body, HttpStatus } from '@nestjs/common';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { SerialService } from './serial.service';
import { CreateSerialDto } from './dtos/create.dto';

@Controller('serials')
export class SerialController {
  constructor(private readonly serialService: SerialService) {}

  @Post()
  async create(@Body() dto: CreateSerialDto) {
    const data = await this.serialService.create(dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get()
  async findAll() {
    const data = await this.serialService.findAll();
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.GET);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const data = await this.serialService.findById(id);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.GET);
  }
}
