import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './order.entity';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { OrderController } from './order.controller';
import { PaymentModule } from '../payment/payment.module';
import { OrderItemModule } from '../orderItem/orderItem.module';
import { UserModule } from '../users/user.module';
import { AddressModule } from '../address/address.module';
import { SerialModule } from '../serials/serial.module';
import { CartItemModule } from '../cartItem/cartItem.module';
import { ProductModule } from '../product/product.module';
import { VariableModule } from '../variables/variable.module';
import { NotificationModule } from '../notification/notification.module';
import { OrderItem, OrderItemSchema } from '../orderItem/orderItem.entity';
import { Product, ProductSchema } from '../product/product.entity';
import {
  ProductWarrantyPolicy,
  ProductWarrantyPolicySchema,
} from '../product-warranty-policy/product-warranty-policy.entity';
import { PromotionModule } from '../promotion/promotion.module';
import { StaffActionLogModule } from '../staffActionLog/staffActionLog.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderItem.name, schema: OrderItemSchema },
      { name: Product.name, schema: ProductSchema },
      { name: ProductWarrantyPolicy.name, schema: ProductWarrantyPolicySchema },
    ]),
    PaymentModule,
    OrderItemModule,
    UserModule,
    AddressModule,
    SerialModule,
    CartItemModule,
    ProductModule,
    VariableModule,
    NotificationModule,
    PromotionModule,
    StaffActionLogModule,
  ],
  providers: [OrderService, OrderRepository],
  controllers: [OrderController],
  exports: [OrderRepository, OrderService],
})
export class OrderModule {}
