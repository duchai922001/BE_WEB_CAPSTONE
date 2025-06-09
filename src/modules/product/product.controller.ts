import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { CreateProductDto } from './dtos/create.dto';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post('')
  async create(@Body() dto: CreateProductDto) {
    const data = await this.productService.create(dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get('form-category')
  async getProductsFormCategory() {
    const data = await this.productService.getProductsFormCategory();
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.GET);
  }
}
