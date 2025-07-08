import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { CreateRepairRequestDto } from './dtos/customer-create-repair-request.dto';
import { RepairRequestService } from './repairRequest.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { AssignRepairRequestDto } from './dtos/assign-staff.dto';
import { UpdateRepairRequestTimestampDto } from './dtos/update-repair-request-timestamp.dto';

@Controller('repair-requests')
export class RepairRequestController {
  constructor(private readonly service: RepairRequestService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateRepairRequestDto, @Request() req) {
    const data = await this.service.create(req.user.userId, dto);
    return createResponse(201, data, ResponseMessage.CREATE);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getByUserId(@Request() req) {
    const data = await this.service.getByUserId(req.user.userId);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get('')
  async findAll(@Query() query: BaseQueryDto) {
    const data = await this.service.findAll(query);
    return createResponse(200, data, ResponseMessage.GET);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const data = await this.service.findById(id);
    return createResponse(200, data, ResponseMessage.GET);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const data = await this.service.updateStatus(id, status);
    return createResponse(200, data, ResponseMessage.UPDATE);
  }
  @Patch(':id/assign')
  async assignStaffAndTechnician(
    @Param('id') id: string,
    @Body() dto: AssignRepairRequestDto,
  ) {
    const data = await this.service.assignStaffAndTechnician(
      id,
      dto.assignedStaffId,
      dto.technicianId,
    );
    return createResponse(200, data, ResponseMessage.UPDATE);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const data = await this.service.delete(id);
    return createResponse(200, data, ResponseMessage.DELETE);
  }

  @Patch('update-timestamp')
  async updateTimestamp(@Body() dto: UpdateRepairRequestTimestampDto) {
    const data = await this.service.updateTimestamp(dto);
    return createResponse(200, data, ResponseMessage.UPDATE);
  }
}
