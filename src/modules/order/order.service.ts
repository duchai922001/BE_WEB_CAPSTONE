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
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { UpdateOrderStatusDto } from './dtos/update-status.dto';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { PayDebtDto } from './dtos/pay-debt.dto';
import { ReturnOrderDto } from './dtos/return-order.dto';
import { PaymentMethod, PaymentType } from 'src/common/enums/payment';
import { OrderNormalStatus } from 'src/common/enums/orderStatus';
import { CartItemRepository } from '../cartItem/cartItem.repository';
import * as dayjs from 'dayjs';
import * as nodemailer from 'nodemailer';
import { ProductRepository } from '../product/product.repository';
import { VariableRepository } from '../variables/variable.repository';
import { SerialRepository } from '../serials/serial.repository';
import { NotificationService } from '../notification/notification.service';
import { NotificationGateway } from '../notification/notification.gateway';
import { NotificationType } from 'src/common/enums/notification-type';
import { AdminCreateOrderDto } from './dtos/admin-create-order.dto';
import { OrderDocument } from './order.entity';
import { PromotionRepository } from '../promotion/promotion.repository';
import { StaffActionLogRepository } from '../staffActionLog/staffActionLog.repository';
import { ActionLogType } from 'src/common/enums/config';
import {
  WarrantyRequest,
  WarrantyRequestDocument,
} from '../warranty-request/warranty-request.entity';
@Injectable()
export class OrderService {
  constructor(
    @InjectModel(WarrantyRequest.name)
    private readonly warrantyRequestModel: Model<WarrantyRequestDocument>,
    @InjectConnection() private readonly connection: Connection,
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly paymentRepo: PaymentRepository,
    private readonly userService: UserService,
    private readonly serialRepo: SerialRepository,
    private readonly serialSer: SerialService,
    private readonly cartItemRepository: CartItemRepository,
    private readonly productRepo: ProductRepository,
    private readonly variRepo: VariableRepository,
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway,
    private readonly promoRepo: PromotionRepository,
    private readonly staffLogRepo: StaffActionLogRepository,
  ) {}
  private transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async updateStockQuantity(
    productId: string,
    typeProduct: number,
    variableId?: string,
    serialCodes?: string[],
    quantity?: number,
  ) {
    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('productId không hợp lệ');
    }

    switch (typeProduct) {
      case ProductType.NO_VARIABLE_NO_SERIAL: {
        if (!quantity) {
          throw new BadRequestException('quantity bắt buộc');
        }
        await this.productRepo.decreaseStock(productId, quantity);
        break;
      }

      case ProductType.NORMAL_SERIALS: {
        if (!serialCodes?.length) {
          throw new BadRequestException('serialCodes bắt buộc');
        }
        const quantity = serialCodes.length;
        await this.serialRepo.markAsSold(productId, serialCodes);
        await this.productRepo.decreaseStock(productId, quantity);
        break;
      }

      case ProductType.NORMAL_VARIABLES: {
        if (!variableId || !quantity) {
          throw new BadRequestException('quantity và variableId bắt buộc');
        }
        if (!Types.ObjectId.isValid(variableId)) {
          throw new BadRequestException('variableId không hợp lệ');
        }
        await this.variRepo.decreaseStock(variableId, quantity);
        await this.productRepo.decreaseStock(productId, quantity);
        break;
      }

      case ProductType.NORMAL_VARIABLES_SERIALS: {
        if (!serialCodes?.length || !variableId) {
          throw new BadRequestException('serialCodes và variableId bắt buộc');
        }
        if (!Types.ObjectId.isValid(variableId)) {
          throw new BadRequestException('variableId không hợp lệ');
        }
        const quantity = serialCodes.length;
        await this.serialRepo.markVariableAsSold(
          productId,
          serialCodes,
          variableId,
        );
        await this.productRepo.decreaseStock(productId, quantity);
        await this.variRepo.decreaseStock(variableId, quantity);
        break;
      }

      default:
        throw new BadRequestException(
          `${ResponseMessage.TYPE_NOT_FOUND} ${typeProduct}`,
        );
    }
  }

  async restoreStockQuantity(
    productId: string,
    typeProduct: number,
    variableId?: string,
    serialCodes?: string[],
    quantity?: number,
  ) {
    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('productId không hợp lệ');
    }

    switch (typeProduct) {
      case ProductType.NO_VARIABLE_NO_SERIAL: {
        if (!quantity) {
          throw new BadRequestException('quantity bắt buộc');
        }
        await this.productRepo.increaseStock(productId, quantity);
        break;
      }

      case ProductType.NORMAL_SERIALS: {
        if (!serialCodes?.length) {
          throw new BadRequestException('serialCodes bắt buộc');
        }
        const quantity = serialCodes.length;
        await this.serialRepo.markAsUnsold(productId, serialCodes);
        await this.productRepo.increaseStock(productId, quantity);
        break;
      }

      case ProductType.NORMAL_VARIABLES: {
        if (!variableId || !quantity) {
          throw new BadRequestException('quantity và variableId bắt buộc');
        }
        if (!Types.ObjectId.isValid(variableId)) {
          throw new BadRequestException('variableId không hợp lệ');
        }
        await this.variRepo.increaseStock(variableId, quantity);
        await this.productRepo.increaseStock(productId, quantity);
        break;
      }

      case ProductType.NORMAL_VARIABLES_SERIALS: {
        if (!serialCodes?.length || !variableId) {
          throw new BadRequestException('serialCodes và variableId bắt buộc');
        }
        if (!Types.ObjectId.isValid(variableId)) {
          throw new BadRequestException('variableId không hợp lệ');
        }
        const quantity = serialCodes.length;
        await this.serialRepo.markVariableAsUnsold(
          productId,
          serialCodes,
          variableId,
        );
        await this.productRepo.increaseStock(productId, quantity);
        await this.variRepo.increaseStock(variableId, quantity);
        break;
      }

      default:
        throw new BadRequestException(
          `${ResponseMessage.TYPE_NOT_FOUND} ${typeProduct}`,
        );
    }
  }
  async createOrder(data: CustomerCreateOrderDto) {
    const session = await this.connection.startSession();
    let order: any;
    const createdOrderItems: any[] = [];
    const user = await this.userService.findUserById(data.userId);
    if (user?.status === 0) {
      throw new BadRequestException('Tài khoản của bạn đã bị khóa');
    }
    try {
      await session.withTransaction(async () => {
        const { orderItems, status, ...payloadOther } = data;
        const isOfflinePayment = [
          PaymentMethod.PAY_IN_STORE,
          PaymentMethod.COD,
        ].includes(data.paymentMethod);

        let customerDept = 0;
        let depositDeadline: Date | undefined = undefined;
        if (data.paymentType === PaymentType.PARTIAL_DEPOSIT) {
          customerDept = data.totalAmount - data.totalAmount * 0.1;
          depositDeadline = dayjs().add(14, 'day').toDate();
        } else if (isOfflinePayment) {
          customerDept = data.totalAmount;
        }

        // Tạo orderCode unique
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
                customerDept:
                  status === OrderNormalStatus.DONE ? 0 : customerDept,
                customerPaid:
                  status === OrderNormalStatus.DONE ? data?.totalAmount : 0,
                status: status ? status : OrderNormalStatus.PENDING,
                ...(depositDeadline && { depositDeadline }),
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

        // Xử lý từng orderItem
        for (const item of data.orderItems || []) {
          const { productId, variableId, quantity, typeProduct } = item;
          let serialCodes: string[] = [];

          if (
            typeProduct === ProductType.NORMAL_SERIALS ||
            typeProduct === ProductType.NORMAL_VARIABLES_SERIALS
          ) {
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

            serialCodes = serials.map((s) => s.serialCode);

            // đánh dấu serial đã bán trong session
            for (const serial of serials) {
              await this.serialSer.updateById(
                (serial as any)._id,
                { isSold: true },
                session,
              );
            }
          }

          if (typeProduct === ProductType.NO_VARIABLE_NO_SERIAL) {
            const stockInStore = await this.productRepo.findById(
              item.productId,
            );

            if (!stockInStore) {
              throw new BadRequestException(
                'Không tìm thấy sản phẩm trong kho',
              );
            }

            if (stockInStore.stock < quantity) {
              throw new BadRequestException(
                'Sản phẩm này không đủ số lượng bạn mua',
              );
            }
          }

          if (typeProduct === ProductType.NORMAL_VARIABLES) {
            const stockInStore = await this.variRepo.findById(item.variableId);

            if (!stockInStore) {
              throw new BadRequestException(
                'Không tìm thấy sản phẩm trong kho',
              );
            }

            if (stockInStore.stock < quantity) {
              throw new BadRequestException(
                'Sản phẩm này không đủ số lượng bạn mua',
              );
            }
          }

          const createdItem = await this.orderItemRepository.create(
            {
              orderId: order._id,
              productId,
              variableId:
                typeProduct === ProductType.NORMAL_SERIALS
                  ? undefined
                  : variableId,
              quantity,
              ...(serialCodes.length > 0 && { serialCodes }),
            },
            { session },
          );

          createdOrderItems.push(createdItem);
        }
      });

      if (data.status === OrderNormalStatus.DONE && data.orderItems?.length) {
        await Promise.all(
          createdOrderItems.map((item, index) =>
            this.updateStockQuantity(
              (data.orderItems as any)[index].productId,
              (data.orderItems as any)[index].typeProduct,
              (data.orderItems as any)[index].variableId,
              item.serialCodes || [],
              item.quantity,
            ),
          ),
        );
      }

      // Xóa cartItem nếu có
      if (data?.cartItemIds?.length) {
        await this.cartItemRepository.deleteManyByIds(data.cartItemIds || []);
      }

      // Gửi notification
      const consultantsAndAdmin =
        await this.userService.getConsultantsAndAdmin();
      for (const staff of consultantsAndAdmin) {
        const notif = await this.notificationService.create({
          userId: (staff as any)._id.toString(),
          title: 'Đơn hàng vừa được tạo',
          message: `Đơn hàng có mã đơn ${order.orderCode} vừa được tạo`,
          type: NotificationType.ORDER,
          targetUrl: `/permission/manage-orders?orderCode=${order.orderCode}`,
        });

        this.notificationGateway.sendNotification(
          (staff as any)._id.toString(),
          notif,
        );
      }

      return order;
    } catch (error) {
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async createOrderInStore(data: AdminCreateOrderDto) {
    const {
      orderItems = [],
      totalAmount,
      customerPaid,
      userId,
      customerName,
      customerPhone,
      ...payloadOther
    } = data;
    let newUser;
    if (customerName && customerPhone) {
      newUser = await this.userService.createUserUnActive({
        fullName: customerName,
        phone: customerPhone,
      });
    }
    const MAX_RETRIES = 5;
    let retry = 0;

    let order: OrderDocument | null = null;

    while (retry < MAX_RETRIES) {
      const orderCode = `${Date.now()}${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`;

      try {
        // Tạo order
        order = await this.orderRepository.create({
          ...payloadOther,
          orderCode,
          userId: userId ?? newUser._id,
          totalAmount,
          customerPaid,
          isConfirm: true,
          paymentMethod: PaymentMethod.PAY_IN_STORE,
          status:
            totalAmount > customerPaid
              ? OrderNormalStatus.DEBT
              : OrderNormalStatus.DONE,
          customerDept: Math.max(totalAmount - customerPaid, 0),
        });

        for (const item of orderItems) {
          const { productId, variableId, quantity, typeProduct, serialCodes } =
            item;

          await this.orderItemRepository.create({
            orderId: (order as any)._id, // đã có OrderDocument nên không cần ép kiểu any nữa
            productId,
            variableId:
              typeProduct === ProductType.NORMAL_SERIALS
                ? undefined
                : variableId,
            quantity,
            serialCodes,
          });
        }

        // Cập nhật tồn kho song song
        await Promise.all(
          orderItems.map((p) =>
            this.updateStockQuantity(
              p.productId,
              p.typeProduct,
              p.variableId,
              p.serialCodes,
              p.quantity,
            ),
          ),
        );

        // Thành công → trả về order luôn
        return order;
      } catch (error: any) {
        // Trùng orderCode → thử lại
        if (error.code === 11000 && error.keyPattern?.orderCode) {
          retry++;
          if (retry >= MAX_RETRIES) {
            throw new Error('Tạo order thất bại: quá số lần thử lại.');
          }
          continue;
        }

        // Lỗi khác → ném ra ngoài
        throw error;
      }
    }

    return order;
  }

  async findAll(query: BaseQueryDto) {
    return await this.orderRepository.findAll(query);
  }

  async findById(id: string) {
    const orderItems = await this.orderItemRepository.getByOrderId(id);
    if (!orderItems || orderItems.length === 0) {
      throw new NotFoundException('Không tìm thấy OrderItem cho đơn hàng này');
    }

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    const variableIds = orderItems
      .filter(
        (item) =>
          [300, 400].includes(Number(item.product.typeProduct)) &&
          item.variableId,
      )
      .map((item) => item.variableId.toString());

    let variablesMap = new Map<string, any>();
    if (variableIds.length) {
      const variables = await this.variRepo.findByIds(variableIds);
      variablesMap = new Map(variables.map((v) => [v._id.toString(), v]));
    }

    const formattedItems = await Promise.all(
      orderItems.map(async (item) => {
        const typeProduct = Number(item.product.typeProduct);
        let sellPrice = 0;
        let costPrice = 0;

        if ([100, 200].includes(typeProduct)) {
          sellPrice = item.product.sellPrice;
          costPrice = item.product.costPrice;
        } else if ([300, 400].includes(typeProduct) && item.variableId) {
          const variable = variablesMap.get(item.variableId.toString());
          if (variable) {
            sellPrice = variable.sellPrice;
            costPrice = variable.costPrice;
          }
        }

        // ✅ Tìm promo cho product
        const promo = await this.promoRepo.findValidByProductId(
          item.product._id.toString(),
        );

        // ✅ Nếu có promo thì tính lại giá bán
        if (promo) {
          if (promo.discountType === 'PERCENT') {
            const discount = (sellPrice * promo.discountValue) / 100;

            const maxDiscount = promo.maxDiscountMoney || discount;
            sellPrice = Math.max(
              sellPrice - Math.min(discount, maxDiscount),
              0,
            );
          } else if (promo.discountType === 'MONEY') {
            sellPrice = Math.max(sellPrice - promo.discountValue, 0);
          }
        }

        return {
          ...item,
          sellPrice,
          costPrice,
          promo: promo || null,
        };
      }),
    );

    return {
      order,
      orderItems: formattedItems,
    };
  }

  async getOrderById(id: string) {
    const order = await this.orderRepository.getOrderById(id);
    return order;
  }

  async update(id: string, data: UpdateOrderDto) {
    const findOrder = await this.orderRepository.findById(id);
    if (!findOrder) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }
    const totalAmountOrder = findOrder.totalAmount + (data.feeShip ?? 0);
    if (data.shippingProvider) {
      await this.transporter.sendMail({
        from: '"Bluetooth Mobile" khangnvmse171448@fpt.edu.vn', // Tên hiển thị + email
        to: (findOrder.userId as any).email,
        subject: `Đơn hàng của bạn đã được giao`,
        text: `ĐƠN HÀNG`,
        html: `
        <p>Đơn vị vận chuyển: <b>${data.shippingProvider}</b></p>
        <p>Mã đơn hàng của bạn là: <b>${data.trackingCode ?? '-'}</b></p>
        <p>Tổng tiền đơn hàng: <b>${findOrder.totalAmount ?? '-'}</b></p>
        <p>Phí ship: <b>${data.feeShip ?? '-'}</b></p>
        <p>Tổng hóa đơn: <b>${totalAmountOrder ?? '-'}</b></p>
        <p>Có gì liên hệ với bluetooth mobile. Cảm ơn bạn</p>`,
      });
    }
    return await this.orderRepository.update(id, data);
  }

  async delete(id: string) {
    return await this.orderRepository.delete(id);
  }

  async getByUserId(userId: string) {
    const orders = await this.orderRepository.getByUserId(userId);
    return orders;
  }

  async searchOrderByOrderCode(keyword: string) {
    const orders = await this.orderRepository.findByKeyword(keyword);
    if (!orders?.length) return [];

    const itemIds: string[] = [];
    for (const o of orders) {
      for (const it of o?.orderItems ?? []) {
        if (it?._id) itemIds.push(String(it._id));
      }
    }
    if (!itemIds.length) return orders;

    const wrs = await this.warrantyRequestModel
      .find({ orderItemId: { $in: itemIds } })
      .select([
        '_id',
        'orderItemId',
        'status',
        'brandTicketNo',
        'serviceCenterName',
        'toBrandTrackingNo',
        'fromBrandTrackingNo',
        'brandDecision',
        'estimatedCost',
        'actualCost',
        'receivedDate',
        'expectedDate',
        'returnedDate',
        'deliveredAt',
        'createdAt',
        'updatedAt',
      ])
      .sort({ createdAt: -1 })
      .lean();

    const wrByItemId = new Map<string, any[]>();
    for (const w of wrs) {
      const key = String(w.orderItemId);
      if (!wrByItemId.has(key)) wrByItemId.set(key, []);
      wrByItemId.get(key)!.push(w);
    }

    const enriched = orders.map((o: any) => ({
      ...o,
      orderItems: (o.orderItems ?? []).map((it: any) => ({
        ...it,
        historyWarranty: wrByItemId.get(String(it._id)) ?? [],
      })),
    }));

    return enriched;
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

  async customerCancelOrder(id: string) {
    return await this.orderRepository.update(id, {
      status: OrderNormalStatus.CANCELLED,
    });
  }
  async updateStatus(id: string, dto: UpdateOrderStatusDto, userId: string) {
    const updatePayload: any = {
      status: dto.status,
    };
    const findOrder = await this.orderRepository.findById(id);
    if (!findOrder) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }
    if (dto.status === OrderNormalStatus.CONFIRMED && userId) {
      if (!dto.products?.length) {
        throw new BadRequestException(
          'products là bắt buộc khi xác nhận đơn hàng',
        );
      }
      updatePayload.employeeId = userId;
      updatePayload.isConfirm = true;
      await Promise.all(
        dto.products.map((p) =>
          this.updateStockQuantity(
            p.productId,
            p.typeProduct,
            p.variableId,
            p.serialCodes,
            p.quantity,
          ),
        ),
      );
      await this.staffLogRepo.create({
        actionType: ActionLogType.CONFIRM,
        description: 'Đơn hàng vừa được nhân viên xác nhận',
        url: `/permission/manage-orders?orderCode=${findOrder.orderCode}`,
        userId: userId,
      });
      await this.transporter.sendMail({
        from: '"Bluetooth Mobile" <khangnvmse171448@fpt.edu.vn>', // Tên hiển thị + email
        to: (findOrder.userId as any).email,
        subject: `Xác nhận giao hàng - Đơn hàng #${findOrder.orderCode}`,
        text: `Xin chào ${(findOrder.userId as any).fullName || 'Quý khách'}`,
        html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #1890ff;">Xác nhận đơn hàng</h2>
      <p>Xin chào <b>${(findOrder.userId as any).fullName || 'Quý khách'}</b>,</p>
      <p>Đơn hàng <b>#${findOrder.orderCode}</b> của bạn đã xác nhận.</p>
   
      
      <hr/>
      <p style="font-size: 14px; color: #666;">
        Cảm ơn bạn đã mua sắm tại <b>Bluetooth Mobile</b>.  
        Nếu có thắc mắc, vui lòng liên hệ hotline <b>0123 456 789</b> hoặc email hỗ trợ: <b>support@bluetoothmobile.vn</b>.
      </p>
    </div>
  `,
      });
    }

    if (dto.status === OrderNormalStatus.PAID_FAIL) {
      await this.orderRepository.update(id, {
        customerDept: findOrder?.totalAmount,
      });
    }

    if (dto.status === OrderNormalStatus.CANCELLED) {
      if (!dto.products?.length) {
        throw new BadRequestException(
          'products là bắt buộc khi xác nhận đơn hàng',
        );
      }
      await this.staffLogRepo.create({
        actionType: ActionLogType.CANCEL,
        description: 'Đơn hàng vừa được nhân viên hủy đơn',
        url: `/permission/manage-orders?orderCode=${findOrder.orderCode}`,
        userId: userId,
      });
      await Promise.all(
        dto.products.map(async (p) => {
          if (p.typeProduct === 300) {
            await this.serialRepo.markAsUnsold(
              p.productId,
              p.serialCodes ?? [],
            );
          } else if (p.typeProduct === 400 || p.typeProduct === 200) {
            await this.serialRepo.markVariableAsUnsold(
              p.productId,
              p.serialCodes ?? [],
              p.variableId,
            );
          }
        }),
      );
    }

    if (
      dto.status === OrderNormalStatus.REFUNDED ||
      dto.status === OrderNormalStatus.DELIVERED_FAILED
    ) {
      if (!dto.products?.length) {
        throw new BadRequestException(
          'products là bắt buộc khi xác nhận đơn hàng',
        );
      }
      await this.staffLogRepo.create({
        actionType: ActionLogType.CANCEL,
        description:
          dto.status === OrderNormalStatus.REFUNDED
            ? 'Đơn hàng vừa được nhân viên hoàn lại đơn'
            : 'Đơn hàng vừa được nhân viên xác nhận giao thất bại',
        url: `/permission/manage-orders?orderCode=${findOrder.orderCode}`,
        userId: userId,
      });
      await Promise.all(
        dto.products.map((p) =>
          this.restoreStockQuantity(
            p.productId,
            p.typeProduct,
            p.variableId,
            p.serialCodes,
            p.quantity,
          ),
        ),
      );
    }

    return this.orderRepository.update(id, updatePayload);
  }

  async payDebt(dto: PayDebtDto) {
    const order = await this.orderRepository.findById(dto.orderId);
    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    if ((order.customerDept || 0) <= 0) {
      throw new BadRequestException('Đơn hàng không còn nợ');
    }

    if (dto.paidAmount > (order.customerDept || 0)) {
      throw new BadRequestException('Số tiền trả vượt quá số tiền nợ');
    }

    const updatedOrder = await this.orderRepository.payDebt(
      dto.orderId,
      dto.paidAmount,
    );
    console.log('vao day di ne');

    // Nếu hết nợ thì update status = PAID
    if (updatedOrder.customerDept === 0) {
      console.log('vao day di');
      await this.orderRepository.update(dto.orderId, {
        status: OrderNormalStatus.PAID,
      });
    }

    return updatedOrder;
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

  async getOrderStats() {
    return await this.orderRepository.getOrderStats();
  }

  async getUserOrderStatistics(userId: string) {
    const pendingCount = await this.orderRepository.countByStatus(
      userId,
      OrderNormalStatus.PENDING,
    );
    const completedCount = await this.orderRepository.countByStatus(
      userId,
      OrderNormalStatus.DONE,
    );
    const canceledCount = await this.orderRepository.countByStatus(
      userId,
      OrderNormalStatus.CANCELLED,
    );
    const totalPaid = await this.orderRepository.sumPaidByUser(userId);
    return {
      pendingCount,
      completedCount,
      canceledCount,
      totalPaid,
    };
  }

  async getOrdersByEmployee(employeeId: string) {
    return await this.orderRepository.getOrdersByEmployee(employeeId);
  }
}
