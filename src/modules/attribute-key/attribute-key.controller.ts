import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { AttributeKeyService } from './attribute-key.service';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';

@Controller('attribute-keys')
export class AttributeKeyController {
  constructor(private readonly service: AttributeKeyService) {}

  @Post()
  async create(@Body('name') name: string) {
    const data = await this.service.create(name);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const data = await this.service.findById(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const data = await this.service.delete(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.DELETE);
  }
}
