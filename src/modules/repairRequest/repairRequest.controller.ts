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
import { UpdateRepairRequestInfoDto } from './dtos/update.dto';
import { UpdateCustomerPaidDto } from './dtos/customer-paid.dto';
import { FilterRepairRequestDto } from './dtos/filter.dto';
import { CreateRepairRequestAdminDto } from './dtos/admin-create.dto';

@Controller('repair-requests')
export class RepairRequestController {
  constructor(private readonly service: RepairRequestService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateRepairRequestDto, @Request() req) {
    const data = await this.service.create(req.user.userId, dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @UseGuards(JwtAuthGuard)
  @Post('system')
  async createRepairAdmin(
    @Body() dto: CreateRepairRequestAdminDto,
    @Request() req,
  ) {
    const data = await this.service.createRepairAdmin(req.user.userId, dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @UseGuards(JwtAuthGuard)
  @Get('technician-stats')
  async getTechnicianStats(@Request() req) {
    const data = await this.service.getTechnicianStats(req.user.userId);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @UseGuards(JwtAuthGuard)
  @Post('requests-by-user')
  async getRequestByUser(@Request() req, @Body() dto: FilterRepairRequestDto) {
    const data = await this.service.getRequestsByUser(req.user.userId, dto);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getByUserId(@Request() req) {
    const data = await this.service.getByUserId(req.user.userId);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get('search')
  async search(@Query('keyword') keyword: string) {
    const data = await this.service.searchWithWarranty(keyword || '');
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
      dto.diagnosis,
      dto.photosReceiving,
    );
    return createResponse(200, data, ResponseMessage.UPDATE);
  }

  @Patch(':id/update-info')
  async updateRepairInfo(
    @Param('id') id: string,
    @Body() dto: UpdateRepairRequestInfoDto,
  ) {
    const data = await this.service.updateRepairInfo(id, dto);
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

  @Patch('customer-paid')
  async updateCustomerPaid(@Body() dto: UpdateCustomerPaidDto) {
    const data = await this.service.updateCustomerPaid(dto);
    return createResponse(
      HttpStatus.OK,
      data,
      'Cập nhật thanh toán thành công',
    );
  }
}
