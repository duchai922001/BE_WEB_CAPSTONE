import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './order.entity';
import { ClientSession, Model } from 'mongoose';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { builderQuery } from 'src/common/helpers/query-builder.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { OrderNormalStatus } from 'src/common/enums/orderStatus';
import { OrderItem, OrderItemDocument } from '../orderItem/orderItem.entity';
import { Product, ProductDocument } from '../product/product.entity';
import {
  ProductWarrantyPolicy,
  ProductWarrantyPolicyDocument,
} from '../product-warranty-policy/product-warranty-policy.entity';
import * as dayjs from 'dayjs';
@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(OrderItem.name)
    private readonly orderItemModel: Model<OrderItemDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(ProductWarrantyPolicy.name)
    private readonly warrantyModel: Model<ProductWarrantyPolicyDocument>,
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
        select: 'fullName phone',
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
      .populate([
        {
          path: 'addressId',
          select: 'street wards districts provinces',
        },
        {
          path: 'userId',
          select: 'fullName email phone', // hoặc các field cần thiết
        },
      ])
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

  async countByStatus(userId: string, status: string): Promise<number> {
    return this.orderModel.countDocuments({
      userId: userId,
      status,
    });
  }

  async sumPaidByUser(userId: string): Promise<number> {
    const result = await this.orderModel.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, totalPaid: { $sum: '$customerPaid' } } },
    ]);

    return result[0]?.totalPaid || 0;
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

  async findByKeyword(keyword: string) {
    keyword = String(keyword).trim();

    const orders: any[] = await this.orderModel.aggregate([
      {
        $lookup: {
          from: 'users',
          let: { userIdStr: '$userId' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: [{ $toString: '$_id' }, '$$userIdStr'] },
              },
            },
            { $project: { fullName: 1, phone: 1 } },
          ],
          as: 'customer',
        },
      },
      { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },

      {
        $match: {
          $or: [
            { orderCode: { $regex: keyword, $options: 'i' } },
            { 'customer.phone': { $regex: keyword, $options: 'i' } },
            { 'customer.fullName': { $regex: keyword, $options: 'i' } },
          ],
        },
      },

      {
        $project: {
          orderCode: 1,
          status: 1,
          totalAmount: 1,
          discountValue: 1,
          customerPaid: 1,
          customerDept: 1,
          'customer._id': 1,
          'customer.fullName': 1,
          'customer.phone': 1,
        },
      },
    ]);

    if (!orders.length) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    for (const order of orders) {
      const orderItems: any[] = await this.orderItemModel
        .find({ orderId: order._id })
        .lean();

      for (const item of orderItems) {
        const product: any = await this.productModel
          .findById(item.productId)
          .lean();
        if (!product) continue;

        let warranty: any = null;
        if (product.productWarrantyPolicyId) {
          const policy: any = await this.warrantyModel
            .findById(product.productWarrantyPolicyId)
            .lean();
          if (policy) {
            // Tính ngày hết hạn dựa trên duration
            const unit = policy.duration.slice(-1); // 'm', 'd', 'h'
            const value = parseInt(policy.duration.slice(0, -1), 10);
            let expiry = dayjs(item.createdAt);

            if (unit === 'm') expiry = expiry.add(value, 'month');
            else if (unit === 'd') expiry = expiry.add(value, 'day');
            else if (unit === 'h') expiry = expiry.add(value, 'hour');

            const now = dayjs();
            const isExpired = now.isAfter(expiry);

            // Tính timeLeft thủ công
            let timeLeft = '';
            if (!isExpired) {
              const diffMs = expiry.diff(now);
              const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
              const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
              const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);
              timeLeft = `${diffDays} ngày ${diffHours} giờ ${diffMinutes} phút`;
            } else {
              timeLeft = 'Đã hết hạn';
            }

            warranty = {
              duration: policy.duration,
              expiryDate: expiry.toDate(),
              isExpired,
              timeLeft,
            };
          }
        }

        item.product = product;
        item.warranty = warranty;
      }

      order.orderItems = orderItems;
    }

    return orders;
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

  async getOrderStats() {
    const totalOrders = await this.orderModel.countDocuments();

    const pendingOrders = await this.orderModel.countDocuments({
      status: OrderNormalStatus.PENDING,
    });

    const processingOrders = await this.orderModel.countDocuments({
      status: {
        $in: [
          OrderNormalStatus.CONFIRMED,
          OrderNormalStatus.PACKING,
          OrderNormalStatus.DELIVERED,
          OrderNormalStatus.DEBT,
        ],
      },
    });

    const doneOrders = await this.orderModel.countDocuments({
      status: OrderNormalStatus.DONE,
    });

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      doneOrders,
    };
  }

  async getOrdersByEmployee(employeeId: string) {
    return this.orderModel
      .find({
        $or: [
          { employeeId: employeeId },
          { employeeId: { $exists: false } },
          { employeeId: null },
        ],
      })
      .sort({ createdAt: -1 })
      .populate({ path: 'userId', select: 'fullName phone' })
      .populate({
        path: 'addressId',
        select: 'street wards districts provinces',
      })
      .lean();
  }
}
