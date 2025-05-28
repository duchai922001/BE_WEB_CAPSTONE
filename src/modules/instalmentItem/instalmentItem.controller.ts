import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { InstalmentItemService } from './instalmentItem.service';
import { CreateInstalmentItemDto } from './dtos/create.dto';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';

@Controller('instalment-items')
export class InstalmentItemController {
  constructor(private readonly service: InstalmentItemService) {}

  @Post()
  create(@Body() dto: CreateInstalmentItemDto) {
    const data = this.service.create(dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get()
  findAll() {
    const data = this.service.findAll();
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    const data = this.service.findById(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: boolean) {
    const data = this.service.updateStatus(id, status);
    return createResponse(HttpStatus.OK, data, ResponseMessage.UPDATE);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    const data = this.service.delete(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.DELETE);
  }
}
