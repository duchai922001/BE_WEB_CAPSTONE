import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { CreateProductDto } from './dtos/create.dto';
import { createResponse } from 'src/common/helpers/response.helper';
import { ProductService } from './product.service';

import { BaseQueryDto } from 'src/common/dtos/base-query.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post('')
  async create(@Body() dto: CreateProductDto) {
    const data = await this.productService.create(dto);
    return createResponse(HttpStatus.CREATED, data, 'Tạo dữ liệu thành công');
  }
  @Get()
  async findAll(@Query() query: BaseQueryDto) {
    const data = await this.productService.getList(query);
    return createResponse(HttpStatus.OK, data, 'Lấy danh sách thành công');
  }
}
