import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RepairInvoiceItemService } from './repair-invoice-item.service';
import { RepairInvoiceItemController } from './repair-invoice-item.controller';
import { RepairInvoiceItemRepository } from './repair-invoice-item.repository';
import {
  RepairInvoiceItem,
  RepairInvoiceItemSchema,
} from './repair-invoice-item.entity';
import { RepairServiceModule } from '../repairService/repairService.module';
import { RepairRequestModule } from '../repairRequest/repairRequest.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RepairInvoiceItem.name, schema: RepairInvoiceItemSchema },
    ]),
    RepairServiceModule,
    forwardRef(() => RepairRequestModule),
  ],
  controllers: [RepairInvoiceItemController],
  providers: [RepairInvoiceItemService, RepairInvoiceItemRepository],
  exports: [RepairInvoiceItemRepository],
})
export class RepairInvoiceItemModule {}
