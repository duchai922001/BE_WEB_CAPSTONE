import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Promotion, PromotionDocument } from './promotion.entity';
import { Model, Types } from 'mongoose';
import { CreatePromotionDto } from './dtos/create.dto';
import {
  ProductImage,
  ProductImageDocument,
} from '../productImage/productImage.entity';

@Injectable()
export class PromotionRepository {
  constructor(
    @InjectModel(Promotion.name)
    private readonly promotionModel: Model<PromotionDocument>,
    @InjectModel(ProductImage.name)
    private productImageModel: Model<ProductImageDocument>,
  ) {}
  async findOverlappedByTime(
    startDate: Date,
    endDate: Date,
  ): Promise<Promotion | null> {
    return this.promotionModel
      .findOne({
        startDate: { $lte: endDate },
        endDate: { $gte: startDate },
      })
      .exec();
  }
  async create(data: CreatePromotionDto): Promise<PromotionDocument> {
    const newPromotion = new this.promotionModel(data);
    return newPromotion.save();
  }

  async findAll(): Promise<PromotionDocument[]> {
    return this.promotionModel
      .find()
      .populate('products')
      .populate('createdBy')
      .exec();
  }

  async findById(id: string): Promise<PromotionDocument | null> {
    return this.promotionModel.findById(id).populate('products').exec();
  }

  async findValidByProductIds(productIds: string[]) {
    // Promotions ACTIVE gắn với từng product
    const promos = await this.promotionModel
      .find({
        products: { $in: productIds.map((id) => id) },
        status: 'active',
      })
      .lean();

    // Promotion DEFAULT (chỉ có 1, áp dụng toàn shop, không cần check ngày)
    const defaultPromo = await this.promotionModel
      .findOne({ status: 'default' })
      .lean();

    return { promos, defaultPromo };
  }

  async findValidByProductId(productId: string) {
    // Tìm promo ACTIVE gắn với product
    const promo = await this.promotionModel
      .findOne({
        products: { $in: [productId] },
        status: 'active',
      })
      .lean();

    // Nếu không có ACTIVE thì lấy DEFAULT
    if (promo) return promo;

    const defaultPromo = await this.promotionModel
      .findOne({ status: 'default' })
      .lean();

    return defaultPromo;
  }

  async getActiveOrDefaultPromotions(): Promise<any[]> {
    let promotions = await this.promotionModel
      .find({ status: 'active' })
      .populate('products')
      .lean()
      .exec();

    if (!promotions || promotions.length === 0) {
      promotions = await this.promotionModel
        .find({ status: 'default' })
        .populate('products')
        .lean()
        .exec();
    }

    const promotionsWithImages = await Promise.all(
      promotions.map(async (promo) => {
        const productsWithImages = await Promise.all(
          promo.products.map(async (product) => {
            const defaultImage = await this.productImageModel
              .findOne({
                productId: String(product._id),
                isDefault: true,
              })
              .lean();
            return {
              ...product,
              defaultImage: defaultImage?.url || null,
            };
          }),
        );

        return {
          ...promo,
          products: productsWithImages,
        };
      }),
    );

    return promotionsWithImages;
  }
}
