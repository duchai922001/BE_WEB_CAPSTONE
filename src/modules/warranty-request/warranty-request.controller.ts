import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
} from '@nestjs/common';
import { WarrantyRequestService } from './warranty-request.service';
import {
  CreateWarrantyRequestDto,
  UpdateWarrantyRequestDto,
  UpdateWarrantyStatusDto,
} from './warranty-request.dto';

@Controller('warranty-requests')
export class WarrantyRequestController {
  constructor(
    private readonly warrantyRequestService: WarrantyRequestService,
  ) {}

  @Post()
  create(@Body() dto: CreateWarrantyRequestDto) {
    return this.warrantyRequestService.create(dto);
  }

  @Get()
  findAll() {
    return this.warrantyRequestService.findAll();
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

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateWarrantyStatusDto,
  ) {
    return this.warrantyRequestService.updateStatus(id, dto);
  }
}
