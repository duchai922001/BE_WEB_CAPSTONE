import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { OrderModule } from '../order/order.module';
import { OrderItemModule } from '../orderItem/orderItem.module';
import { PromotionModule } from '../promotion/promotion.module';
import { RepairRequestModule } from '../repairRequest/repairRequest.module';
import { RepairInvoiceItemModule } from '../repair-invoice-item/repair-invoice-item.module';

@Module({
  imports: [
    OrderModule,
    OrderItemModule,
    PromotionModule,
    RepairRequestModule,
    RepairInvoiceItemModule,
  ],
  providers: [InvoiceService],
  controllers: [InvoiceController],
})
export class InvoiceModule {}
