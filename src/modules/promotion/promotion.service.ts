import { PromotionRepository } from './promotion.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Promotion } from './promotion.entity';
import { CreatePromotionDto } from './dtos/create.dto';
import { PromotionImageRepository } from '../promotionImage/promotionImage.repository';

@Injectable()
export class PromotionService {
  constructor(
    private readonly promotionRepository: PromotionRepository,
    private readonly promotionImageRepository: PromotionImageRepository,
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
