import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './product.entity';
import { Model, Types } from 'mongoose';
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

  async updateQuantity(productId: string, newQuantity: number): Promise<void> {
    await this.productModel.updateOne(
      { _id: productId },
      { $set: { stock: newQuantity } },
    );
  }

  async removeSerialFromProduct(
    productId: string,
    serial: string,
  ): Promise<void> {
    await this.productModel.updateOne(
      { _id: productId },
      {
        $pull: { serials: serial },
        $inc: { stock: -1 },
      },
    );
  }

  async checkProductInListProducts(
    listProductIds: string[],
  ): Promise<ProductDocument[]> {
    return await this.productModel
      .find({ _id: { $in: listProductIds } })
      .exec();
  }

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

  async productsSoftDelete(
    productIds: string[] | Types.ObjectId[],
  ): Promise<any> {
    return this.productModel
      .updateMany({ _id: { $in: productIds } }, { $set: { isDelete: true } })
      .exec();
  }

  async softDelete(id: string): Promise<Product> {
    const product = await this.productModel.findOneAndUpdate(
      { _id: id, isDelete: false },
      { isDelete: true },
      { new: true },
    );

    if (!product) {
      throw new BadRequestException(
        'Không tìm thấy sản phẩm hoặc sản phẩm đã bị xoá trước đó',
      );
    }

    return product;
  }

  async update(id: string, updateData: any): Promise<Product | null> {
    return this.productModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }
}
