import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WarrantyRequestService } from './warranty-request.service';
import {
  CreateWarrantyRequestDto,
  GetWarrantyRequestsDto,
  UpdateWarrantyRequestDto,
  UpdateWarrantyStatusDto,
} from './warranty-request.dto';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('warranty-requests')
export class WarrantyRequestController {
  constructor(
    private readonly warrantyRequestService: WarrantyRequestService,
  ) {}

  @Post()
  create(@Body() dto: CreateWarrantyRequestDto) {
    return this.warrantyRequestService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history-warranty-order')
  async findByCustomer(@Query() q: GetWarrantyRequestsDto, @Request() req) {
    const data = await this.warrantyRequestService.findByCustomer(
      req.user.userId,
      q,
    );
    return createResponse(200, data, ResponseMessage.GET);
  }

  @Get()
  async list(
    @Query('status') status?: string,
    @Query('q') q?: string,
    @Query('limit') limit = '20',
    @Query('page') page = '1',
  ) {
    const data = await this.warrantyRequestService.list({
      status,
      q,
      limit: +limit,
      page: +page,
    });
    return createResponse(200, data, ResponseMessage.GET);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateWarrantyStatusDto,
  ) {
    const data = await this.warrantyRequestService.updateStatus(id, dto);
    return createResponse(200, data, ResponseMessage.UPDATE);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warrantyRequestService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWarrantyRequestDto) {
    return this.warrantyRequestService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warrantyRequestService.remove(id);
  }
}
