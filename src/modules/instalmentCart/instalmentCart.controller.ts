import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { CreateInstalmentCartDto } from './dtos/create.dto';
import { InstalmentCartService } from './instalmentCart.service';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';

@Controller('instalment-carts')
export class InstalmentCartController {
  constructor(private readonly instalmentCartService: InstalmentCartService) {}

  @Post()
  async create(@Body() dto: CreateInstalmentCartDto) {
    const data = await this.instalmentCartService.create(dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get(':userId')
  async findByUserId(@Param('userId') userId: string) {
    const data = await this.instalmentCartService.findByUserId(userId);
    return createResponse(HttpStatus.OK, data, ResponseMessage.UPDATE);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Query('status') status: string) {
    const data = await this.instalmentCartService.updateStatus(
      id,
      status === 'true',
    );
    return createResponse(HttpStatus.OK, data, ResponseMessage.UPDATE);
  }

  @Get()
  async findAll() {
    const data = await this.instalmentCartService.findAll();
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }
}
