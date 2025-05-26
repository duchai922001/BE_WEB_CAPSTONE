import { Controller, Post, Get, Param, Body, HttpStatus } from '@nestjs/common';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { StaffActionLogService } from './staffActionLog.service';
import { CreateActionLogDto } from './dtos/create.dto';

@Controller('action-logs')
export class StaffActionLogController {
  constructor(private readonly staffActionLogService: StaffActionLogService) {}

  @Post()
  async create(@Body() dto: CreateActionLogDto) {
    const data = await this.staffActionLogService.create(dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get()
  async findAll() {
    const data = await this.staffActionLogService.getAllLogs();
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.GET);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const data = await this.staffActionLogService.getLogDetail(id);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.GET);
  }
}
