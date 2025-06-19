import { PromotionRepository } from './promotion.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Promotion } from './promotion.entity';
import { CreatePromotionDto } from './dtos/create.dto';

@Injectable()
export class PromotionService {
  constructor(private readonly promotionRepository: PromotionRepository) {}

  async create(data: CreatePromotionDto): Promise<Promotion> {
    return this.promotionRepository.create({
      ...data,
    });
  }

  async getAll(): Promise<Promotion[]> {
    return this.promotionRepository.findAll();
  }
}
