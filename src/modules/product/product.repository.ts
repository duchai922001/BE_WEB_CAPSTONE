import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product, ProductDocument } from './product.entity';
import { Model, SortOrder, Types } from 'mongoose';
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

  async findByBrandId(
    brandId: string,
    sortBy: string = 'sellPrice',
    sortOrder: 'asc' | 'desc' = 'asc',
  ) {
    const sort: Record<string, SortOrder> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };

    return this.productModel
      .find({ brandId })
      .sort(sort)
      .populate('brandId categoryId')
      .exec();
  }

  async findByCategoryId(
    categoryId: string,
    sortBy: string = 'sellPrice',
    sortOrder: 'asc' | 'desc' = 'asc',
  ) {
    const sort: Record<string, SortOrder> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };
    return this.productModel
      .find({ categoryId: categoryId })
      .sort(sort)
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

  async findWithPagination(query: BaseQueryDto) {
    const { page = '1', limit = '10', keyword } = query;

    const filter: any = {};

    if (keyword) {
      filter.name = { $regex: keyword, $options: 'i' };
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const [data, total] = await Promise.all([
      this.productModel
        .find(filter)
        .select('_id name costPrice sellPrice stock barcode')
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .sort({ createdAt: -1 }),
      this.productModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    };
  }

  async findManyByIds(ids: string[]): Promise<Product[]> {
    return this.productModel.find({ _id: { $in: ids } });
  }

  async updateOne(id: string, data: Partial<Product>): Promise<void> {
    await this.productModel.updateOne({ _id: id }, { $set: data });
  }

  async decreaseStock(productId: string, quantity: number) {
    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('ID sản phẩm không hợp lệ');
    }

    if (quantity <= 0) {
      throw new BadRequestException('Số lượng phải lớn hơn 0');
    }

    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Tồn kho không đủ');
    }

    product.stock -= quantity;
    await product.save();

    return {
      message: 'Cập nhật tồn kho thành công',
      product,
    };
  }

  async increaseStock(productId: string, quantity: number) {
    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('ID sản phẩm không hợp lệ');
    }

    if (quantity <= 0) {
      throw new BadRequestException('Số lượng phải lớn hơn 0');
    }

    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }

    product.stock += quantity;
    await product.save();

    return {
      message: 'Cập nhật tồn kho thành công',
      product,
    };
  }

  async getRecommendedProducts(productId: string, limit: number = 10) {
    // Lấy thông tin sản phẩm gốc
    const product = await this.productModel.findById(productId).lean();
    if (!product) return [];

    const priceRange = {
      $gte: product.sellPrice * 0.5, // giá >= 50% giá gốc
      $lte: product.sellPrice * 1.5, // giá <= 150% giá gốc
    };

    // Query sản phẩm tương tự (ưu tiên theo price range)
    const query: any = {
      _id: { $ne: product._id }, // loại trừ sản phẩm gốc
      categoryId: product.categoryId,
      sellPrice: priceRange,
    };

    if (product.brandId) {
      query.brandId = product.brandId;
    }

    let recommended = await this.productModel.find(query).limit(limit).lean();

    // Nếu số lượng chưa đủ thì lấy thêm sản phẩm trong category
    if (recommended.length < limit) {
      const excludeIds = [product._id, ...recommended.map((p) => p._id)];

      const fillProducts = await this.productModel
        .find({
          _id: { $nin: excludeIds },
          categoryId: product.categoryId,
        })
        .limit(limit - recommended.length)
        .lean();

      recommended = [...recommended, ...fillProducts];
    }

    return recommended;
  }
}
