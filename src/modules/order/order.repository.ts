import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './order.entity';
import { ClientSession, Model } from 'mongoose';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { builderQuery } from 'src/common/helpers/query-builder.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { OrderNormalStatus } from 'src/common/enums/orderStatus';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async create(
    data: any,
    options?: { session?: ClientSession },
  ): Promise<OrderDocument> {
    const newOrder = new this.orderModel(data);
    return newOrder.save({ session: options?.session });
  }

  async findAll(query: BaseQueryDto): Promise<OrderDocument[]> {
    const { filter, pagination, sort } = builderQuery(query);
    const queryBuilder = this.orderModel
      .find(filter)
      .populate({
        path: 'userId',
        select: 'fullName',
      })
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

  async update(id: string, data: any): Promise<OrderDocument | null> {
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

  async countQuantityByUserId(userId: string): Promise<number> {
    const count = await this.orderModel.countDocuments({
      userId,
      status: OrderNormalStatus.PENDING,
    });
    return count;
  }

  async findByOrderCode(orderCode: string) {
    const order = await this.orderModel.findOne({ orderCode });
    if (!order) {
      throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    }
    return order;
  }

  async payDebt(orderId: string, amount: number) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new Error('Order not found');

    if (order.customerDept <= 0) throw new Error('Không còn nợ để thanh toán');

    if (amount > order.customerDept) throw new Error('Số tiền vượt quá số nợ');

    order.customerPaid += amount;
    order.customerDept -= amount;

    return order.save();
  }

  async returnOrder(orderId: string, returnAmount: number, reason: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new Error('Order not found');

    if (order.isReturnedOrder) {
      throw new Error('Đơn hàng đã được hoàn trước đó');
    }

    if (returnAmount > order.customerPaid) {
      throw new Error('Số tiền hoàn vượt quá số tiền khách đã trả');
    }

    order.isReturnedOrder = true;
    order.reason = reason;
    order.customerPaid -= returnAmount;
    order.customerDept = Math.max(0, order.customerDept - returnAmount);

    return order.save();
  }
}
