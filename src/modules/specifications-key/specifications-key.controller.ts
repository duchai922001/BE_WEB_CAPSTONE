import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { SpecificationsKeyService } from './specifications-key.service';
import { CreateSpecificationsKeyDto } from './dto/create-specifications-key.dto';
import { UpdateSpecificationsKeyDto } from './dto/update-specifications-key.dto';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';

@Controller('specifications-keys')
export class SpecificationsKeyController {
  constructor(private readonly service: SpecificationsKeyService) {}

  @Post()
  async create(@Body() dto: CreateSpecificationsKeyDto) {
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

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSpecificationsKeyDto,
  ) {
    const data = await this.service.update(id, dto);
    return createResponse(HttpStatus.OK, data, ResponseMessage.UPDATE);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.service.delete(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.DELETE);
  }
}
