import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PromotionImage,
  PromotionImageDocument,
} from './promotionImage.entity';
import { CreatePromotionImageDto } from './dtos/create.dto';

@Injectable()
export class PromotionImageRepository {
  constructor(
    @InjectModel(PromotionImage.name)
    private readonly promotionImageModel: Model<PromotionImageDocument>,
  ) {}

  async create(data: CreatePromotionImageDto): Promise<PromotionImage> {
    const newPromotionImage = new this.promotionImageModel(data);
    return newPromotionImage.save();
  }

  async findById(id: string): Promise<PromotionImageDocument | null> {
    return this.promotionImageModel.findOne({ _id: id }).exec();
  }

  async findAll(): Promise<PromotionImageDocument[]> {
    return this.promotionImageModel.find().exec();
  }

  async deleteById(id: string): Promise<void> {
    await this.promotionImageModel.findByIdAndDelete(id).exec();
  }
}
