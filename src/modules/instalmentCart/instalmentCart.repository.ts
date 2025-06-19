import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  InstalmentCart,
  InstalmentCartDocument,
} from './instalmentCart.entity';
import { CreateInstalmentCartDto } from './dtos/create.dto';

@Injectable()
export class InstalmentCartRepository {
  constructor(
    @InjectModel(InstalmentCart.name)
    private readonly model: Model<InstalmentCartDocument>,
  ) {}

  async create(data: CreateInstalmentCartDto): Promise<InstalmentCart> {
    const newCart = new this.model(data);
    return newCart.save();
  }

  async findByUserId(userId: string): Promise<InstalmentCart | null> {
    return this.model.findOne({ userId }).exec();
  }

  async updateStatus(
    id: string,
    status: boolean,
  ): Promise<InstalmentCart | null> {
    return this.model.findByIdAndUpdate(id, { status }, { new: true }).exec();
  }

  async findAll(): Promise<InstalmentCart[]> {
    return this.model.find().exec();
  }

  async getOrCreateInstalmentCart(
    userId: string,
  ): Promise<InstalmentCartDocument> {
    let cart = await this.model.findOne({ userId });
    if (!cart) cart = await this.model.create({ userId });
    return cart;
  }
}
