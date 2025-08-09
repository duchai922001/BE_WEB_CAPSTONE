import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { RepairWarrantyPolicyService } from './repair-warranty-policy.service';
import {
  CreateRepairWarrantyPolicyDto,
  UpdateRepairWarrantyPolicyDto,
} from './repair-warranty-policy.dto';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { createResponse } from 'src/common/helpers/response.helper';

@Controller('repair-warranty-policies')
export class RepairWarrantyPolicyController {
  constructor(private readonly policyService: RepairWarrantyPolicyService) {}

  @Post()
  async create(@Body() dto: CreateRepairWarrantyPolicyDto) {
    const data = await this.policyService.create(dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get()
  async findAll() {
    const data = await this.policyService.findAll();
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.policyService.findOne(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRepairWarrantyPolicyDto,
  ) {
    const data = await this.policyService.update(id, dto);
    return createResponse(HttpStatus.OK, data, ResponseMessage.UPDATE);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.policyService.remove(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.DELETE);
  }
}
