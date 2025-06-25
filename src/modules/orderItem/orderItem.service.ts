import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderItemRepository } from './orderItem.repository';
import { CreateOrderItemDto } from './dtos/create-orderItem.dto';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';

@Injectable()
export class OrderItemService {
  constructor(
    private readonly orderItemRepository: OrderItemRepository,
  ) {}

  async create(dto: CreateOrderItemDto) {
    return await this.orderItemRepository.create(dto);
  }

  async findAll(query: BaseQueryDto) {
    return await this.orderItemRepository.findAll(query);
  }

  async findById(id: string) {
    const OrderItem = await this.orderItemRepository.findById(id);
    if (!OrderItem) throw new NotFoundException('Không tìm thấy OrderItem');
    return OrderItem;
  }

  async delete(id: string) {
    const ok = await this.orderItemRepository.delete(id);
    if (!ok) throw new NotFoundException('Không thể xóa OrderItem');
  }

  async getByOrderId(orderId: string) {
    const orderItems = await this.orderItemRepository.getByOrderId(orderId);
    if (!orderItems || orderItems.length === 0) {
      throw new NotFoundException('Không tìm thấy OrderItem cho đơn hàng này');
    }
    return orderItems;
  }
}
