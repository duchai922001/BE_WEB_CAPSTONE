import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './order.entity';
import { Model } from 'mongoose';
import { CustomerCreateOrderDto } from './dtos/customer-create-order.dto';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { builderQuery } from 'src/common/helpers/query-builder.helper';
import { UpdateOrderDto } from './dtos/update-order.dto';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async create(data: CustomerCreateOrderDto): Promise<OrderDocument> {
    const newOrder = new this.orderModel(data);
    return newOrder.save();
  }

  async findAll(query: BaseQueryDto): Promise<OrderDocument[]> {
    const { filter, pagination, sort } = builderQuery(query);
    const queryBuilder = this.orderModel
      .find(filter)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort(sort as any);
    return queryBuilder.exec();
  }

  async findById(id: string): Promise<OrderDocument | null> {
    const order = await this.orderModel.findById(id).exec();
    return order;
  }
  async update(
    id: string,
    data: UpdateOrderDto,
  ): Promise<OrderDocument | null> {
    return this.orderModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.orderModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}
