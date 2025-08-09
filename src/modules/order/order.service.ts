import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { ProductType } from 'src/common/enums/productType';
import { SerialService } from '../serials/serial.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { UpdateOrderStatusDto } from './dtos/update-status.dto';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { PayDebtDto } from './dtos/pay-debt.dto';
import { ReturnOrderDto } from './dtos/return-order.dto';
import { PaymentMethod } from 'src/common/enums/payment';
import { OrderNormalStatus } from 'src/common/enums/orderStatus';
import { CartItemRepository } from '../cartItem/cartItem.repository';

@Injectable()
export class OrderService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly paymentRepo: PaymentRepository,
    private readonly userService: UserService,
    private readonly serialSer: SerialService,
    private readonly cartItemRepository: CartItemRepository,
  ) {}

  async createOrder(data: CustomerCreateOrderDto) {
    const session = await this.connection.startSession();
    let order: any;

    try {
      await session.withTransaction(async () => {
        const { orderItems, ...payloadOther } = data;
        const isOfflinePayment = [
          PaymentMethod.PAY_IN_STORE,
          PaymentMethod.COD,
        ].includes(data.paymentMethod);
        // 2. Tạo mã đơn hàng retry như cũ (trong transaction)
        const MAX_RETRIES = 5;
        let retry = 0;
        let orderCode: string;

        while (retry < MAX_RETRIES) {
          orderCode = `${Date.now()}${Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, '0')}`;

          try {
            order = await this.orderRepository.create(
              {
                ...payloadOther,
                orderCode,
                customerDept: isOfflinePayment ? data.totalAmount : 0,
              },
              { session },
            );
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

        // 3. Xử lý từng item
        for (const item of data.orderItems || []) {
          const { productId, variableId, quantity, typeProduct } = item;

          if (
            typeProduct === ProductType.NO_VARIABLE_NO_SERIAL ||
            typeProduct === ProductType.NORMAL_VARIABLES
          ) {
            // Sản phẩm không cần serial
            await this.orderItemRepository.create(
              {
                orderId: order._id,
                productId,
                variableId,
                quantity,
              },
              { session },
            );
          } else if (
            typeProduct === ProductType.NORMAL_SERIALS ||
            typeProduct === ProductType.NORMAL_VARIABLES_SERIALS
          ) {
            // Sản phẩm có serial
            const serials = await this.serialSer.find(
              {
                productId,
                isSold: false,
                variableId:
                  typeProduct === ProductType.NORMAL_SERIALS
                    ? null
                    : variableId,
              },
              quantity,
              session,
            );

            if (serials.length < quantity) {
              throw new BadRequestException('Sản phẩm này đã hết hàng');
            }

            const serialCodes = serials.map((serial) => serial.serialCode);

            await this.orderItemRepository.create(
              {
                orderId: order._id,
                productId,
                variableId:
                  typeProduct === ProductType.NORMAL_SERIALS
                    ? undefined
                    : variableId,
                quantity,
                serialCodes,
              },
              { session },
            );

            for (const serial of serials) {
              await this.serialSer.updateById(
                (serial as any)._id,
                { isSold: true },
                session,
              );
            }
          }
        }
      });
      await this.cartItemRepository.deleteManyByIds(data.cartItemIds || []);
      return order;
    } catch (error) {
      throw error;
    } finally {
      await session.endSession();
    }
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

  async getQuantityByUserId(userId: string) {
    const count = await this.orderRepository.countQuantityByUserId(userId);
    return count;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto, userId: string) {
    const updatePayload: any = {
      status: dto.status,
    };

    if (dto.status === OrderNormalStatus.CONFIRMED && userId) {
      updatePayload.employeeId = userId;
    }

    return this.orderRepository.update(id, updatePayload);
  }

  async payDebt(dto: PayDebtDto) {
    const order = await this.orderRepository.findById(dto.orderId);
    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    if (order.customerDept <= 0) {
      throw new BadRequestException('Đơn hàng không còn nợ');
    }

    if (dto.paidAmount > order.customerDept) {
      throw new BadRequestException('Số tiền trả vượt quá số tiền nợ');
    }

    return this.orderRepository.payDebt(dto.orderId, dto.paidAmount);
  }

  async returnOrder(dto: ReturnOrderDto) {
    const order = await this.orderRepository.findById(dto.orderId);
    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    if (order.isReturnedOrder) {
      throw new BadRequestException('Đơn hàng đã được hoàn trước đó');
    }

    if (dto.returnAmount > order.customerPaid) {
      throw new BadRequestException(
        'Số tiền hoàn vượt quá số tiền khách đã trả',
      );
    }

    return this.orderRepository.returnOrder(
      dto.orderId,
      dto.returnAmount,
      dto.reason,
    );
  }

  async rollBack(orderId: string) {
    const findOrder = await this.orderItemRepository.getByOrderId(orderId);
    if (!findOrder.length) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    for (const item of findOrder) {
      if (item.serialCodes && item.serialCodes.length > 0) {
        for (const serialCode of item.serialCodes) {
          await this.serialSer.updateBySerialCode(serialCode, {
            isSold: false,
          });
        }
      }
    }
  }
}
