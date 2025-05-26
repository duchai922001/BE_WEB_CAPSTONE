import { InjectModel } from '@nestjs/mongoose';
import { ProductImage, ProductImageDocument } from './productImage.entity';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateProductImageDto } from './dtos/create.dto';

@Injectable()
export class ProductImageRepository {
  constructor(
    @InjectModel(ProductImage.name)
    private readonly productImageModel: Model<ProductImageDocument>,
  ) {}

  create(data: CreateProductImageDto): Promise<ProductImage> {
    return this.productImageModel.create(data);
  }

  findById(id: string) {
    return this.productImageModel.findById(id).populate('productId');
  }
}
