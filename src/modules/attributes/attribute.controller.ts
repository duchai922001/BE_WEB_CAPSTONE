import { Controller, Post, Get, Param, Body, HttpStatus } from '@nestjs/common';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { AttributeService } from './attribute.service';
import { CreateAttributeDto } from './dtos/create.dto';

@Controller('attributes')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Post()
  async create(@Body() dto: CreateAttributeDto) {
    const data = await this.attributeService.create(dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get()
  async findAll() {
    const data = await this.attributeService.findAll();
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.GET);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const data = await this.attributeService.findById(id);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.GET);
  }
}
