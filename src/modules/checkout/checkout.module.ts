import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { OrderModule } from '../order/order.module';
import { VnpayService } from './vnpay/vnpay.service';
import { ZaloPayService } from './zalopay/zalopay.service';

@Module({
  imports: [OrderModule],
  controllers: [CheckoutController],
  providers: [VnpayService, ZaloPayService],
})
export class CheckoutModule {}
