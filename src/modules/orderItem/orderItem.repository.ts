import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OrderItem, OrderItemDocument } from './orderItem.entity';
import { Model, Types } from 'mongoose';
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

  async getByOrderId(orderId: string): Promise<any[]> {
    const orderItems = await this.OrderItemModel.find({
      orderId: new Types.ObjectId(orderId),
    })
      .populate({
        path: 'productId',
        select: 'name sellPrice',
      })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    if (!orderItems || orderItems.length === 0) {
      throw new Error('No order items found for the given order ID');
    }

    // ✅ Đổi tên productId thành product
    const formattedItems = orderItems.map((item) => {
      const { productId, ...rest } = item;
      return {
        ...rest,
        product: productId,
      };
    });

    return formattedItems;
  }
}
