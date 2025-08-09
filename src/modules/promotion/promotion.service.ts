import { PromotionRepository } from './promotion.repository';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Promotion } from './promotion.entity';
import { CreatePromotionDto } from './dtos/create.dto';
import { PromotionImageRepository } from '../promotionImage/promotionImage.repository';
import { ProductRepository } from '../product/product.repository';

@Injectable()
export class PromotionService {
  constructor(
    private readonly promotionRepository: PromotionRepository,
    private readonly promotionImageRepository: PromotionImageRepository,
    private readonly productRepo: ProductRepository,
  ) {}

  async create(data: CreatePromotionDto): Promise<any> {
    const {
      createdBy,
      description,
      discountType,
      endDate,
      startDate,
      title,
      discountValue,
      products,
      promotionImages,
    } = data;
    const isOverlapped = await this.promotionRepository.findOverlappedByTime(
      new Date(startDate),
      new Date(endDate),
    );

    if (isOverlapped) {
      throw new BadRequestException(
        'Đã có khuyến mãi trong khoảng thời gian này',
      );
    }
    const newPromotion = await this.promotionRepository.create({
      createdBy,
      description,
      discountType,
      endDate,
      startDate,
      title,
      discountValue,
      products,
    });
    if (promotionImages && promotionImages.length > 0) {
      await this.promotionImageRepository.createMany(
        promotionImages.map((image) => ({
          url: image.url,
          type: image.type,
          promotionId: (newPromotion as any)._id.toString(),
        })),
      );
    }
    if (products && products.length > 0) {
      const productDocs = await this.productRepo.findManyByIds(products);

      for (const product of productDocs) {
        const sellPrice = product.sellPrice;
        let salePrice = sellPrice;

        if (typeof discountValue === 'number') {
          if (discountType === 'PERCENT') {
            salePrice = Math.round(sellPrice * (1 - discountValue / 100));
          } else if (discountType === 'MONEY') {
            salePrice = Math.max(sellPrice - discountValue, 0);
          }
        }

        await this.productRepo.updateOne((product as any)._id, {
          salePrice,
          isPromotion: true,
          promotionId: (newPromotion as any)._id.toString(),
        });
      }
    }

    return newPromotion;
  }

  async getAll(): Promise<Promotion[]> {
    return this.promotionRepository.findAll();
  }

  async getPromotionById(id: string): Promise<any> {
    const promotion = await this.promotionRepository.findById(id);
    const images = await this.promotionImageRepository.findByPromotionId(
      (promotion as any)._id.toString(),
    );
    if (!promotion) {
      throw new NotFoundException(`Promotion with id ${id} not found`);
    }
    return { promotion, images };
  }
}
