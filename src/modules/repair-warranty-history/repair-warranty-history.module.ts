import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RepairWarrantyHistory,
  RepairWarrantyHistorySchema,
} from './repair-warranty-history.entity';
import { RepairWarrantyHistoryController } from './repair-warranty-history.controller';
import { RepairWarrantyHistoryService } from './repair-warranty-history.service';
import {
  RepairRequest,
  RepairRequestSchema,
} from '../repairRequest/repairRequest.entity';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RepairWarrantyHistory.name, schema: RepairWarrantyHistorySchema },
      { name: RepairRequest.name, schema: RepairRequestSchema },
    ]),
    NotificationModule,
  ],

  controllers: [RepairWarrantyHistoryController],
  providers: [RepairWarrantyHistoryService],
  exports: [RepairWarrantyHistoryService],
})
export class RepairWarrantyHistoryModule {}
