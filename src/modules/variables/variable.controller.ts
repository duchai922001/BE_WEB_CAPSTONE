import { Body, Controller, Delete, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { CreateVariableDto } from './dtos/create.dto';
import { VariableService } from './variable.service';
import { createResponse } from 'src/common/helpers/response.helper';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';

@Controller('variables')
export class VariableController {
  constructor(private readonly variableService: VariableService) {}
  @Post('')
  async create(@Body() dto: CreateVariableDto) {
    const data = await this.variableService.create(dto);
    return createResponse(HttpStatus.CREATED, data, 'Tạo dữ liệu thành công');
  }

  @Get()
  async getList(@Query() query: BaseQueryDto) {
    const data = await this.variableService.getList(query);
    return createResponse(HttpStatus.OK, data, 'Lấy danh sách thành công');
  }
  
  @Delete(':id')
  async softDelete(@Query('id') id: string) {
    const data = await this.variableService.softDelete(id);
    return createResponse(HttpStatus.OK, data, 'Xóa thành công');
  }
}
