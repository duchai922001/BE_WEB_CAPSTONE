import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Put,
  Post,
  Query,
} from '@nestjs/common';
import { CreateBrandDto } from './dtos/create.dto';
import { BrandService } from './brand.service';
import { createResponse } from 'src/common/helpers/response.helper';
import { UpdateBrandDto } from './dtos/update.dto';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post('')
  async create(@Body() dto: CreateBrandDto) {
    const data = await this.brandService.create(dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get('')
  async getAll(@Query() query: BaseQueryDto) {
    const data = await this.brandService.getAll(query);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const data = await this.brandService.findById(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    const data = await this.brandService.update(id, dto);
    return createResponse(HttpStatus.OK, data, ResponseMessage.UPDATE);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const data = await this.brandService.delete(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.DELETE);
  }

  @Get('by-category/:categoryId')
  async getBrandsByCategory(@Param('categoryId') categoryId: string) {
    const data = await this.brandService.getBrandsByCategory(categoryId);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }
}
