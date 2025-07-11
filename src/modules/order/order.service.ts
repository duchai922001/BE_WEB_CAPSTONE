import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import {
  CustomerCreateOrderDto,
  OrderItems,
} from './dtos/customer-create-order.dto';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { PaymentRepository } from '../payment/payment.repository';
import { OrderItemRepository } from '../orderItem/orderItem.repository';
import { UserService } from '../users/user.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly paymentRepo: PaymentRepository,
    private readonly userService: UserService,
  ) {}

  async createOrder(data: CustomerCreateOrderDto) {
    const { orderItems, ...payloadOther } = data;

    const MAX_RETRIES = 5;
    let retry = 0;
    let orderCode: string;
    let order: any;

    while (retry < MAX_RETRIES) {
      orderCode = `${Date.now()}${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`;

      try {
        order = await this.orderRepository.create({
          ...payloadOther,
          orderCode,
        });
        break;
      } catch (error) {
        if (error.code === 11000 && error.keyPattern?.orderCode) {
          retry++;
          continue;
        }
        throw error;
      }
    }

    if (!order) {
      throw new Error('Could not create unique orderCode after retries');
    }

    if (orderItems?.length) {
      await Promise.all(
        orderItems.map((item: OrderItems) =>
          this.orderItemRepository.create({
            orderId: order._id,
            productId: item.productId,
            quantity: item.quantity,
            variableId: item.variableId,
          }),
        ),
      );
    }

    return order;
  }

  async findAll(query: BaseQueryDto) {
    return await this.orderRepository.findAll(query);
  }

  async findById(id: string) {
    const orderItems = await this.orderItemRepository.getByOrderId(id);
    const order = await this.orderRepository.findById(id);
    return {
      order,
      orderItems,
    };
  }

  async getOrderById(id: string) {
    const order = await this.orderRepository.getOrderById(id);
    return order;
  }

  async update(id: string, data: UpdateOrderDto) {
    return await this.orderRepository.update(id, data);
  }

  async delete(id: string) {
    return await this.orderRepository.delete(id);
  }

  async getByUserId(userId: string) {
    const orders = await this.orderRepository.getByUserId(userId);
    // const responseData = await Promise.all(
    //   orders.map(async (order) => {
    //     const payment = await this.paymentRepo.findByOrderId(
    //       (order as any)._id.toString(),
    //     );
    //     return {
    //       order,
    //       payment,
    //     };
    //   }),
    // );
    return orders;
  }

  async searchOrderByOrderCode(orderCode: string) {
    return await this.orderRepository.findByOrderCode(orderCode);
  }

  async getUserByOrderId(id: string) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new BadRequestException('Không tìm thấy Order');
    }
    const user = await this.userService.getById(order.userId.toString());
    if (!user) {
      throw new BadRequestException('Không tìm thấy User theo Order ID');
    }

    return user;
  }
}
