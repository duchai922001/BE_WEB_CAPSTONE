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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    PaymentModule,
    OrderItemModule,
    UserModule,
    AddressModule,
    SerialModule,
    CartItemModule,
  ],
  providers: [OrderService, OrderRepository],
  controllers: [OrderController],
  exports: [OrderRepository, OrderService],
})
export class OrderModule {}
