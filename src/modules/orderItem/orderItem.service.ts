import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderItemRepository } from './orderItem.repository';
import { CreateOrderItemDto } from './dtos/create-orderItem.dto';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { VariableRepository } from '../variables/variable.repository';
import { PromotionRepository } from '../promotion/promotion.repository';

@Injectable()
export class OrderItemService {
  constructor(
    private readonly orderItemRepository: OrderItemRepository,
    private readonly variableRepository: VariableRepository,
    private readonly promotionRepository: PromotionRepository,
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

    // lấy list productIds để query promotion
    const productIds = orderItems.map((item) => item.product._id.toString());
    const { promos, defaultPromo } =
      await this.promotionRepository.findValidByProductIds(productIds);

    const result = await Promise.all(
      orderItems.map(async (item) => {
        let sellPrice = 0;
        let costPrice = 0;

        const typeProduct = Number(item.product.typeProduct);

        if ([100, 200].includes(typeProduct)) {
          sellPrice = item.product.sellPrice;
          costPrice = item.product.costPrice;
        } else if ([300, 400].includes(typeProduct) && item.variableId) {
          // Lấy giá từ Variable
          const variable = await this.variableRepository.findById(
            item.variableId,
          );
          if (variable) {
            sellPrice = variable.sellPrice;
            costPrice = variable.costPrice;
          }
        }

        // tìm promotion áp dụng cho sản phẩm này
        const productPromos = promos.filter((p) =>
          p.products?.some(
            (pid) => pid.toString() === item.product._id.toString(),
          ),
        );

        return {
          ...(item.toObject?.() ?? item),
          sellPrice,
          costPrice,
          promos: productPromos, // promotion riêng của sản phẩm
          defaultPromo, // promotion toàn shop
        };
      }),
    );

    return result;
  }
}
