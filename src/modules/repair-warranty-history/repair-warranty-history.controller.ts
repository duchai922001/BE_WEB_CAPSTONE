import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RepairWarrantyHistoryService } from './repair-warranty-history.service';
import {
  CreateRepairWarrantyHistoryDto,
  QueryRepairWarrantyHistoryDto,
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get()
  findAll(@Query() query: QueryRepairWarrantyHistoryDto) {
    return this.service.findAll(query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRepairWarrantyHistoryDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.service.updateStatus(id, dto);
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
