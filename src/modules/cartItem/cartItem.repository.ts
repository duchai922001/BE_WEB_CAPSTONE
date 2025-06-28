import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CartItem, CartItemDocument } from './cartItem.entity';
import { Model } from 'mongoose';
import { CreateCartItemDto } from './dtos/create-cartItem';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { builderQuery } from 'src/common/helpers/query-builder.helper';

@Injectable()
export class CartItemRepository {
  constructor(
    @InjectModel(CartItem.name)
    private readonly cartItemModel: Model<CartItemDocument>,
  ) {}

  async create(data: CreateCartItemDto): Promise<CartItemDocument> {
    return new this.cartItemModel(data).save();
  }

  async findAll(query: BaseQueryDto): Promise<CartItemDocument[]> {
    const { filter, pagination, sort } = builderQuery(query);
    const queryBuilder = this.cartItemModel
      .find(filter)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort(sort as any);
    return queryBuilder.exec();
  }

  async addItem(cartId: string, productId: string, quantity: number) {
    return this.cartItemModel.findOneAndUpdate(
      { cartId, productId },
      { $inc: { quantity }, $setOnInsert: { isSelec: true } },
      { upsert: true, new: true },
    );
  }

  async findById(id: string): Promise<CartItemDocument | null> {
    return this.cartItemModel.findById(id).exec();
  }

  async incrementQuantity(
    id: string,
    delta: number,
  ): Promise<CartItemDocument | null> {
    return this.cartItemModel
      .findByIdAndUpdate(id, { $inc: { quantity: delta } }, { new: true })
      .exec();
  }

  async softDelete(id: string): Promise<CartItemDocument | null> {
    return this.cartItemModel
      .findByIdAndUpdate(id, { status: 0 }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.cartItemModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async getItems(cartId: string) {
    return this.cartItemModel.find({ cartId }).populate('productId');
  }
}
