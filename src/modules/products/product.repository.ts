import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './product.entity';
import { Model } from 'mongoose';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { builderQuery } from 'src/common/helpers/query-builder.helper';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(data: any): Promise<Product> {
    const newProduct = new this.productModel(data);
    return newProduct.save();
  }

  async find(query: BaseQueryDto): Promise<ProductDocument[]> {
    const { filter, pagination, sort } = builderQuery(query);

    const queryBuilder = this.productModel
      .find(filter)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort(sort as any);

    return queryBuilder.exec();
  }

  async count(query: BaseQueryDto) {
    const { filter } = builderQuery(query);
    return this.productModel.countDocuments(filter).exec();
  }

  async softDelete(id: string): Promise<Product> {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      { isDelete: true },
      { new: true },
    );
    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm để xoá');
    }
    if (product.isDelete) {
      throw new BadRequestException('Sản phẩm đã bị xoá trước đó');
    }
    return product.save();
  }
}
