import { InjectModel } from '@nestjs/mongoose';
import { ProductImage, ProductImageDocument } from './productImage.entity';
import { Model, Types } from 'mongoose';
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

  async findDefaultByProductIds(productIds: string[]) {
    return this.productImageModel
      .find({
        productId: { $in: productIds },
        isDefault: true,
      })
      .lean();
  }

  async findDefaultImageByProductId(productId: string) {
    return this.productImageModel.findOne({
      productId,
      isDefault: true,
    });
  }

  async findByProductId(productId: string) {
    return this.productImageModel.find({
      productId: productId,
    });
  }
}
