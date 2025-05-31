import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CartItem, CartItemDocument } from './cartItem.entity';
import { Model } from 'mongoose';
import { CreateCartItemDto } from './dtos/create-cartItem';

@Injectable()
export class CartItemRepository {
  constructor(
    @InjectModel(CartItem.name)
    private readonly cartItemModel: Model<CartItemDocument>,
  ) {}

  async create(data: CreateCartItemDto): Promise<CartItemDocument> {
    return new this.cartItemModel(data).save();
  }

  async findAll(): Promise<CartItemDocument[]> {
    return this.cartItemModel.find().exec();
  }

  async findById(id: string): Promise<CartItemDocument | null> {
    return this.cartItemModel.findById(id).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.cartItemModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}
