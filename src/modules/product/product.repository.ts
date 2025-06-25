import { Injectable, NotFoundException } from '@nestjs/common';
import { Product, ProductDocument } from './product.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ICreate } from './dtos/product.interface';
import { builderQuery } from 'src/common/helpers/query-builder.helper';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { Brand, BrandDocument } from '../brands/brand.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(data: ICreate): Promise<ProductDocument> {
    const newVariable = new this.productModel(data);
    return newVariable.save();
  }

  async findProductByName(name: string): Promise<Product | null> {
    return this.productModel.findOne({ name }).exec();
  }

  async findById(id: string): Promise<ProductDocument | null> {
    return this.productModel.findById(id).exec();
  }

  async updateById(
    id: string,
    data: Partial<ICreate>,
  ): Promise<ProductDocument | null> {
    return this.productModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async deleteById(id: string): Promise<void> {
    await this.productModel.findByIdAndDelete(id).exec();
  }

  async findAll(): Promise<ProductDocument[]> {
    return this.productModel.find().exec();
  }

  async search(query: BaseQueryDto) {
    const builder = builderQuery(query);

    const [items, total] = await Promise.all([
      this.productModel
        .find(builder.filter)
        .skip(builder.pagination.skip)
        .limit(builder.pagination.limit)
        .sort(builder.sort)
        .populate(builder.populate)
        .lean(),

      this.productModel.countDocuments(builder.filter),
    ]);

    return {
      items,
      total,
      page: Number(query.page || 1),
      limit: Number(query.limit || 10),
    };
  }

  async findByBrandId(brandId: string) {
    return this.productModel
      .find({ brandId: brandId })
      .populate('brandId categoryId')
      .exec();
  }

  async findByCategoryId(categoryId: string) {
    return this.productModel
      .find({ categoryId: categoryId })
      .populate('brandId categoryId')
      .exec();
  }

  async getBrandIdsByCategoryId(categoryId: string) {
    const products = await this.productModel
      .find({ categoryId })
      .select('brandId')
      .exec();
    const brandIdSet = new Set(products.map((p) => p.brandId.toString()));
    return Array.from(brandIdSet).map((id) => new Types.ObjectId(id));
  }
}
