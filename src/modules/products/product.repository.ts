import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './product.entity';
import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }
    return product;
  }

  async softDelete(id: string): Promise<Product> {
    const product = await this.productModel.findOneAndUpdate(
      { _id: id, isDelete: false }, // chỉ update nếu chưa xóa
      { isDelete: true },
      { new: true },
    );

    if (!product) {
      throw new BadRequestException('Không tìm thấy sản phẩm hoặc sản phẩm đã bị xoá trước đó');
    }

    return product;
  }

  async update(id: string, data: any): Promise<Product> {
    const updateProduct = await this.productModel.findByIdAndUpdate(
      id,
      { ...data },
      { new: true, runValidators: true },
    );

    if (!updateProduct) {
      throw new NotFoundException('Không tìm thấy sản phẩm để cập nhật');
    }

    return updateProduct;
  }
}
