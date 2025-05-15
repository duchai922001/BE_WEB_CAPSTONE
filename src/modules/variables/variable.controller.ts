import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { CreateVariableDto } from './dtos/create.dto';
import { VariableService } from './variable.service';
import { createResponse } from 'src/common/helpers/response.helper';

@Controller('variables')
export class VariableController {
  constructor(private readonly variableService: VariableService) {}
  @Post('')
  async create(@Body() dto: CreateVariableDto) {
    const data = await this.variableService.create(dto);
    return createResponse(HttpStatus.CREATED, data, 'Tạo dữ liệu thành công');
  }
}
