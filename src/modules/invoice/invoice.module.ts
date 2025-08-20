import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { OrderModule } from '../order/order.module';
import { OrderItemModule } from '../orderItem/orderItem.module';
import { PromotionModule } from '../promotion/promotion.module';

@Module({
  imports: [OrderModule, OrderItemModule, PromotionModule],
  providers: [InvoiceService],
  controllers: [InvoiceController],
})
export class InvoiceModule {}
