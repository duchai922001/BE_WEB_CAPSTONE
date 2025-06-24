import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Promotion, PromotionDocument } from './promotion.entity';
import { Model, Types } from 'mongoose';
import { CreatePromotionDto } from './dtos/create.dto';

@Injectable()
export class PromotionRepository {
  constructor(
    @InjectModel(Promotion.name)
    private readonly promotionModel: Model<PromotionDocument>,
  ) {}

  async create(data: CreatePromotionDto): Promise<PromotionDocument> {
    const newPromotion = new this.promotionModel(data);
    return newPromotion.save();
  }

  async findAll(): Promise<PromotionDocument[]> {
    return this.promotionModel.find().populate('products').exec();
  }

  async findById(id: string): Promise<PromotionDocument | null> {
    return this.promotionModel.findById(id).populate('products').exec();
  }
}
