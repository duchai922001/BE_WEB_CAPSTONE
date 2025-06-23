import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OrderItem, OrderItemDocument } from './orderItem.entity';
import { Model } from 'mongoose';
import { CreateOrderItemDto } from './dtos/create-orderItem.dto';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { builderQuery } from 'src/common/helpers/query-builder.helper';

@Injectable()
export class OrderItemRepository {
  constructor(
    @InjectModel(OrderItem.name)
    private readonly OrderItemModel: Model<OrderItemDocument>,
  ) {}

  async create(data: CreateOrderItemDto): Promise<OrderItemDocument> {
    return new this.OrderItemModel(data).save();
  }

  async findAll(query: BaseQueryDto): Promise<OrderItemDocument[]> {
    const { filter, pagination, sort } = builderQuery(query);
    const queryBuilder = this.OrderItemModel.find(filter)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort(sort as any);
    return queryBuilder.exec();
  }

  async findById(id: string): Promise<OrderItemDocument | null> {
    return this.OrderItemModel.findById(id).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.OrderItemModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async getByOrderId(orderId: string): Promise<OrderItemDocument[]> {
    const orderItems = await this.OrderItemModel.find({ orderId })
      .sort({ createdAt: -1 })
      .exec();
    console.log(orderItems);
    console.log('Order Items:', orderItems);
    if (!orderItems || orderItems.length === 0) {
      throw new Error('No order items found for the given order ID');
    }
    return orderItems;
  }
}
