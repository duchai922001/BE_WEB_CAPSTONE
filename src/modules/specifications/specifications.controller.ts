import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SpecificationsService } from './specifications.service';
import {
  CreateSpecificationDto,
  UpdateSpecificationDto,
} from './dto/specifications.dto';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';

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

  @Get(':productId')
  async getByProductId(@Param('productId') productId: string) {
    const data = await this.service.findByProductId(productId);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateSpecificationDto) {
    return this.service.update(id, body);
  }
}
