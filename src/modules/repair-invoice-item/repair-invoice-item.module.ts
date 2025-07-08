import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RepairInvoiceItemService } from './repair-invoice-item.service';
import { RepairInvoiceItemController } from './repair-invoice-item.controller';
import { RepairInvoiceItemRepository } from './repair-invoice-item.repository';
import {
  RepairInvoiceItem,
  RepairInvoiceItemSchema,
} from './repair-invoice-item.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RepairInvoiceItem.name, schema: RepairInvoiceItemSchema },
    ]),
  ],
  controllers: [RepairInvoiceItemController],
  providers: [RepairInvoiceItemService, RepairInvoiceItemRepository],
})
export class RepairInvoiceItemModule {}
