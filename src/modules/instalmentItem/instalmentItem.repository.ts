import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  InstalmentItem,
  InstalmentItemDocument,
} from './instalmentItem.entity';
import { CreateInstalmentItemDto } from './dtos/create.dto';

@Injectable()
export class InstalmentItemRepository {
  constructor(
    @InjectModel(InstalmentItem.name)
    private readonly model: Model<InstalmentItemDocument>,
  ) {}

  async create(dto: CreateInstalmentItemDto): Promise<InstalmentItem> {
    const item = new this.model(dto);
    return item.save();
  }

  async findAll(): Promise<InstalmentItem[]> {
    return this.model.find().populate('productId instalmentCartId').exec();
  }

  async findById(id: string): Promise<InstalmentItem | null> {
    return this.model
      .findById(id)
      .populate('productId instalmentCartId')
      .exec();
  }

  async updateStatus(
    id: string,
    status: boolean,
  ): Promise<InstalmentItem | null> {
    return this.model.findByIdAndUpdate(id, { status }, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}
