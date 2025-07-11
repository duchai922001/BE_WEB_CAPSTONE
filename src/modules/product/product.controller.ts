import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create.dto';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { ProductService } from './product.service';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post('')
  async create(@Body() dto: CreateProductDto) {
    const data = await this.productService.create(dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get()
  async getProducts(@Query() query: BaseQueryDto) {
    const data = await this.productService.getList(query);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get('form-category')
  async getProductsFormCategory() {
    const data = await this.productService.getProductsFormCategory();
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get('detail/:id')
  async getDetail(@Param('id') id: string) {
    const data = await this.productService.getProductDetailById(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get('search')
  async searchProducts(@Query() query: BaseQueryDto) {
    const data = await this.productService.searchProducts(query);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get('brand/:brandName')
  async getByBrandName(
    @Param('brandName') brandName: string,
    @Query() query: BaseQueryDto,
  ) {
    const data = await this.productService.getProductsByBrandName(
      brandName,
      query,
    );
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get('category/:categoryName')
  async getByCategoryName(@Param('categoryName') brandName: string) {
    const data = await this.productService.getProductsByCategoryName(brandName);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }
}
