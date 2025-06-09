import { Injectable } from '@nestjs/common';
import { PromotionImageRepository } from './promotionImage.repository';
import { CreatePromotionImageDto } from './dtos/create.dto';
import { PromotionImage } from './promotionImage.entity';

@Injectable()
export class PromotionImageService {
  constructor(
    private readonly promotionImageRepository: PromotionImageRepository,
  ) {}

  async create(data: CreatePromotionImageDto): Promise<PromotionImage> {
    const { promotionId, url, type } = data;
    const promotionImage = await this.promotionImageRepository.create({
      promotionId,
      url,
      type,
    });
    return promotionImage;
  }

  async getPromotionImageById(id: string): Promise<PromotionImage | null> {
    const promotionImage = await this.promotionImageRepository.findById(id);
    if (!promotionImage) {
      return null;
    }
    return promotionImage;
  }

  async getAllPromotionImages(): Promise<PromotionImage[]> {
    return this.promotionImageRepository.findAll();
  }

  async delete(id: string): Promise<void> {
    return await this.promotionImageRepository.deleteById(id);
  }
}
