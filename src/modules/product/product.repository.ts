import { Injectable, NotFoundException } from '@nestjs/common';
import { Product, ProductDocument } from './product.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ICreate } from './dtos/product.interface';
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

  async findByBrandId(brandId: string) {
    return this.productModel
      .find({ brandId: brandId })
      .populate('brandId categoryId')
      .exec();
  }
}
