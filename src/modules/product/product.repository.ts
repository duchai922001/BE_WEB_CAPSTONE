import { Injectable } from '@nestjs/common';
import { Product, ProductDocument } from './product.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ICreate } from './dtos/product.interface';

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
}
