import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateInstalmentRequestDto } from './dtos/create.dto';
import { InstalmentRequestService } from './instalmentRequest.service';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('instalment-requests')
export class InstalmentRequestController {
  constructor(private readonly service: InstalmentRequestService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateInstalmentRequestDto, @Request() req) {
    const data = this.service.create(req.user.userId, dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get('get-id/:id')
  findById(@Param('id') id: string) {
    const data = this.service.findById(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Patch(':id/status/:status')
  updateStatus(@Param('id') id: string, @Param('status') status: string) {
    const data = this.service.updateStatus(id, status);
    return createResponse(HttpStatus.OK, data, ResponseMessage.UPDATE);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getByUserId(@Request() req) {
    const data = await this.service.getRequestsByUser(req.user.userId);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }
}
