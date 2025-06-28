import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  Patch,
  HttpStatus,
} from '@nestjs/common';
import { RepairServiceService } from './repairService.service';
import { CreateRepairServiceDto } from './dtos/create.dto';
import { UpdateRepairServiceDto } from './dtos/update.dto';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';

@Controller('repair-service')
export class RepairServiceController {
  constructor(private readonly service: RepairServiceService) {}

  @Post()
  async create(@Body() dto: CreateRepairServiceDto) {
    const data = await this.service.create(dto);
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

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRepairServiceDto) {
    const data = await this.service.update(id, dto);
    return createResponse(HttpStatus.OK, data, ResponseMessage.UPDATE);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: boolean },
  ) {
    const data = await this.service.updateStatus(id, body.status);
    return createResponse(HttpStatus.OK, data, ResponseMessage.UPDATE);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const data = await this.service.delete(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.DELETE);
  }
}
