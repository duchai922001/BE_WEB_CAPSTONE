import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create.dto';
import { CategoryService } from './category.service';
import { createResponse } from 'src/common/helpers/response.helper';
import { UpdateCategoryDto } from './dtos/update.dto';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('')
  async create(@Body() dto: CreateCategoryDto) {
    const data = await this.categoryService.create(dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get('')
  async getAll(@Query() query: BaseQueryDto) {
    const data = await this.categoryService.getAll(query);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const data = await this.categoryService.getById(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    const data = await this.categoryService.update(id, dto);
    return createResponse(HttpStatus.OK, data, ResponseMessage.UPDATE);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const data = await this.categoryService.delete(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.DELETE);
  }
}
