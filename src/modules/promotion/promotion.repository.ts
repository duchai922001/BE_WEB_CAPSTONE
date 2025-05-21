import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Promotion, PromotionDocument } from './promotion.entity';
import { Model } from 'mongoose';

@Injectable()
export class PromotionRepository {
  constructor(
    @InjectModel(Promotion.name)
    private readonly promotionModel: Model<PromotionDocument>,
  ) {}

  async create(data: any): Promise<Promotion> {
    const newPromotion = new this.promotionModel(data);
    return newPromotion.save();
  }

  async findAll(): Promise<Promotion[]> {
    return this.promotionModel.find().exec();
  }

  async findById(id: string): Promise<Promotion | null> {
    return this.promotionModel.findById(id).exec();
  }

  async update(
    id: string,
    data: Partial<Promotion>,
  ): Promise<Promotion | null> {
    const promotion = await this.promotionModel.findById(id);
    if (!promotion) {
      return null;
    }
    Object.assign(promotion, data);
    return promotion.save();
  }

  async softDelete(id: string): Promise<Promotion | null> {
    return this.promotionModel
      .findByIdAndUpdate(id, { isDelete: true }, { new: true })
      .exec();
  }
}
