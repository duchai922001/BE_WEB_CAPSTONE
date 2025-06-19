import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './cart.entity';
import { Model } from 'mongoose';
import { CreateCartDto } from './dtos/create-cart.dto';
import { PromotionDocument } from '../promotion/promotion.entity';

@Injectable()
export class CartRepository {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: Model<CartDocument>,
  ) {}

  async create(data: CreateCartDto): Promise<CartDocument> {
    const newCart = new this.cartModel(data);
    return newCart.save();
  }

  async findAll(): Promise<CartDocument[]> {
    return this.cartModel.find().exec();
  }

  async findById(id: string): Promise<CartDocument | null> {
    return this.cartModel.findById(id).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.cartModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async getOrCreateCart(userId: string): Promise<CartDocument> {
    let cart = await this.cartModel.findOne({ userId });
    if (!cart) cart = await this.cartModel.create({ userId });
    return cart;
  }
}
