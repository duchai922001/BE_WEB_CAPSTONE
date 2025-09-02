import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpStatus,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { RepairWarrantyHistoryService } from './repair-warranty-history.service';
import {
  CreateRepairWarrantyHistoryDto,
  GetWarrantyHistoryQueryDto,
  UpdatePhotosDto,
  UpdateRepairWarrantyHistoryDto,
  UpdateStatusDto,
} from './repair-warranty-history.dto';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { createResponse } from 'src/common/helpers/response.helper';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('warranty-histories')
export class RepairWarrantyHistoryController {
  constructor(private readonly service: RepairWarrantyHistoryService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateRepairWarrantyHistoryDto, @Request() req) {
    const data = await this.service.create(req.user.userId, dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get('/by-request/:repairRequestId')
  async findByRequest(@Param('repairRequestId') repairRequestId: string) {
    const data =
      await this.service.getSummaryByRepairRequestId(repairRequestId);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history-warranty-repair')
  async findByUser(@Query() q: GetWarrantyHistoryQueryDto, @Request() req) {
    const data = await this.service.findByUser(req.user.userId, q);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getByStaff(@Request() req) {
    const data = await this.service.getByStaff(req.user.userId);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRepairWarrantyHistoryDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    const data = await this.service.updateStatus(id, dto);
    return createResponse(HttpStatus.OK, data, ResponseMessage.UPDATE);
  }

  @Patch(':id/photos')
  updatePhotos(@Param('id') id: string, @Body() dto: UpdatePhotosDto) {
    return this.service.updatePhotos(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
