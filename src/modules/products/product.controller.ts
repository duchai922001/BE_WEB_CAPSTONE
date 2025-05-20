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
import { CreateProductDto } from './dtos/create.dto';
import { createResponse } from 'src/common/helpers/response.helper';
import { ProductService } from './product.service';

import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { UpdateProductDto } from './dtos/update.dto';
import { DeleteListProductDto } from './dtos/delete-list.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post('')
  async create(@Body() dto: CreateProductDto) {
    const data = await this.productService.create(dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get('')
  async findAll(@Query() query: BaseQueryDto) {
    const data = await this.productService.getList(query);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.productService.getProductDetail(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const data = await this.productService.softDelete(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.DELETE);
  }

  @Delete('list/delete')
  async actionSoftDeleteList(@Body() dto: DeleteListProductDto) {
    await this.productService.deleteListProductsSoft(dto);
    return createResponse(HttpStatus.OK, null, ResponseMessage.DELETE_LIST);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const updated = await this.productService.update(id, updateProductDto);
    return createResponse(HttpStatus.OK, updated, ResponseMessage.UPDATE);
  }

  @Post('serials')
  async getSerials(
    @Body() payload: { productId: string; variableId?: string },
  ) {
    const data = await this.productService.getSerials(payload);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get('variables/:id')
  async getVariables(@Param('id') id: string) {
    const data = await this.productService.getVariables(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }
}
