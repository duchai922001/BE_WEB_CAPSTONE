import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './order.entity';
import { Model } from 'mongoose';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { builderQuery } from 'src/common/helpers/query-builder.helper';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { ResponseMessage } from 'src/common/enums/responseMessage';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async create(data: any): Promise<OrderDocument> {
    const newOrder = new this.orderModel(data);
    return newOrder.save();
  }

  async findAll(query: BaseQueryDto): Promise<OrderDocument[]> {
    const { filter, pagination, sort } = builderQuery(query);
    const queryBuilder = this.orderModel
      .find(filter)
      .populate({
        path: 'addressId',
        select: 'street wards districts provinces',
      })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort(sort as any);

    return queryBuilder.exec();
  }

  async findById(id: string): Promise<OrderDocument | null> {
    const order = await this.orderModel
      .findById(id)
      .populate({
        path: 'addressId',
        select: 'street wards districts provinces',
      })
      .exec();
    return order;
  }

  async getOrderById(id: string): Promise<OrderDocument | null> {
    const order = await this.orderModel
      .findById(id)
      .populate({
        path: 'addressId',
        select: 'street wards districts provinces',
      })
      .exec();
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

  async getByUserId(userId: string): Promise<OrderDocument[]> {
    const orders = await this.orderModel
      .find({ userId })
      .populate({
        path: 'addressId',
        select: 'street wards districts provinces',
      })
      .sort({ createdAt: -1 })
      .exec();
    if (!orders || orders.length === 0) {
      throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    }
    return orders;
  }

  async findByOrderCode(orderCode: string) {
    const order = await this.orderModel.findOne({ orderCode });
    if (!order) {
      throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    }
    return order;
  }
}
