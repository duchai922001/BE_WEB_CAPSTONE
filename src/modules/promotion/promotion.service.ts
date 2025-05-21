import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Promotion, PromotionDocument } from './promotion.entity';
import { CreatePromotionDto } from './dtos/create.dto';
import { UpdatePromotionDto } from './dtos/update.dto';

@Injectable()
export class PromotionService {
  constructor(
    @InjectModel(Promotion.name)
    private readonly promotionModel: Model<PromotionDocument>,
  ) {}

  async create(dto: CreatePromotionDto): Promise<Promotion> {
    const createdPromotion = new this.promotionModel(dto);
    return createdPromotion.save();
  }

  async findAll(): Promise<Promotion[]> {
    return this.promotionModel.find({ isDelete: false }).exec();
  }

  async findById(id: string): Promise<Promotion> {
    const promotion = await this.promotionModel.findById(id).exec();
    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }
    return promotion;
  }

  async update(id: string, dto: UpdatePromotionDto): Promise<Promotion> {
    const promotion = await this.promotionModel.findById(id);
    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }

    Object.assign(promotion, dto);
    return promotion.save();
  }

  async softDelete(id: string): Promise<Promotion> {
    const updated = await this.promotionModel.findByIdAndUpdate(
      id,
      { isDelete: true },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }

    return updated;
  }
}
