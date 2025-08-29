import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateProductDto } from './dtos/create.dto';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { ProductService } from './product.service';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { UpdateProductDto } from './dtos/update.dto';
import { FilterProductDto } from './dtos/filter.dto';
import { ProductType } from 'src/common/enums/productType';
import { FileInterceptor } from '@nestjs/platform-express';
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

  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    const data = await this.productService.update(id, dto);
    return createResponse(HttpStatus.OK, data, ResponseMessage.UPDATE);
  }

  @Post('import-excel')
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(
    @UploadedFile() file: Express.Multer.File,
    @Query('typeProduct') typeProduct: ProductType,
  ) {
    if (!file) {
      throw new Error('Vui lòng upload file Excel');
    }

    const data = await this.productService.importFromExcel(
      file.buffer,
      typeProduct,
    );

    return {
      message: 'Import thành công',
      data,
    };
  }

  @Get('export-template')
  async exportTemplateExcel(
    @Query('typeProduct') typeProduct: ProductType,
    @Res() res: Response,
  ) {
    const buffer = await this.productService.exportTemplateExcel(typeProduct);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="product_template_${typeProduct}.xlsx"`,
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    res.end(buffer);
  }

  @Get('export')
  async exportExcel(@Res() res: Response) {
    const buffer = await this.productService.exportExcelProduct();

    res.setHeader(
      'Content-Disposition',
      'attachment; filename="sanpham_bluetoothmobile.xlsx"',
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    res.end(buffer);
  }

  @Get('recommendations/:id')
  async getRecommendedProducts(@Param('id') id: string) {
    const data = await this.productService.getRecommendedProducts(id);
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

  @Post('brand/:brandName')
  async getByBrandName(
    @Param('brandName') brandName: string,
    @Body() query: FilterProductDto,
  ) {
    const data = await this.productService.getProductsByBrandName(
      brandName,
      query,
    );
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Post('category/:categoryName')
  async getByCategoryName(
    @Param('categoryName') brandName: string,
    @Body() query: FilterProductDto,
  ) {
    const data = await this.productService.getProductsByCategoryName(
      brandName,
      query,
    );
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }
}
