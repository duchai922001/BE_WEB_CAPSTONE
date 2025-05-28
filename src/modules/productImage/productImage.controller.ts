import { Controller, Post, Get, Param, Body, HttpStatus } from '@nestjs/common';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { ProductImageService } from './productImage.service';
import { CreateProductImageDto } from './dtos/create.dto';

@Controller('product-image')
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @Post()
  async create(@Body() dto: CreateProductImageDto) {
    const data = await this.productImageService.create(dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const data = await this.productImageService.findById(id);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.GET);
  }
}
