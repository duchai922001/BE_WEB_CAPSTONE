import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { SpecificationsService } from './specifications.service';
import {
  CreateSpecificationDto,
  UpdateSpecificationDto,
} from './dto/specifications.dto';

@Controller('specifications')
export class SpecificationsController {
  constructor(private readonly service: SpecificationsService) {}

  @Post('bulk')
  createBulk(@Body() body: CreateSpecificationDto[]) {
    return this.service.createBulk(body);
  }

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateSpecificationDto) {
    return this.service.update(id, body);
  }
}
