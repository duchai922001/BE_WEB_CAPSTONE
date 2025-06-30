import { Body, Controller, Post, HttpStatus, Get, Query } from '@nestjs/common';

import { CreateRepairRequestServiceDto } from './dtos/create.dto';
import { RepairRequestServiceService } from './repairRequestService.service';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { createResponse } from 'src/common/helpers/response.helper';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';

@Controller('repair-request-service')
export class RepairRequestServiceController {
  constructor(
    private readonly repairRequestServiceService: RepairRequestServiceService,
  ) {}

  @Post('')
  async create(@Body() dto: CreateRepairRequestServiceDto) {
    const data = await this.repairRequestServiceService.create(dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get('')
  async getAll(@Query() query: BaseQueryDto) {
    const data = await this.repairRequestServiceService.getAll(query);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }
}
