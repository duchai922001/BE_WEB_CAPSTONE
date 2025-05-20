import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { CreateVariableDto } from './dtos/create.dto';
import { VariableService } from './variable.service';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';

@Controller('variables')
export class VariableController {
  constructor(private readonly variableService: VariableService) {}
  @Post('')
  async create(@Body() dto: CreateVariableDto) {
    const data = await this.variableService.create(dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const data = await this.variableService.findById(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }
}
