import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RepairRequest, RepairRequestSchema } from './repairRequest.entity';
import { RepairRequestController } from './repairRequest.controller';
import { RepairRequestService } from './repairRequest.service';
import { RepairRequestRepository } from './repairRequest.repository';
import { RepairRequestServiceModule } from '../repairRequestService/repairRequestService.module';
import { RepairRequestImageModule } from '../repairRequestImage/repairRequestImage.module';
import { RepairWarrantyPolicyModule } from '../repair-warranty-policy/repair-warranty-policy.module';
import { RepairInvoiceItemModule } from '../repair-invoice-item/repair-invoice-item.module';
import { RepairServiceModule } from '../repairService/repairService.module';
import { NotificationModule } from '../notification/notification.module';
import { UserModule } from '../users/user.module';
import { StaffActionLogModule } from '../staffActionLog/staffActionLog.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RepairRequest.name, schema: RepairRequestSchema },
    ]),
    RepairRequestServiceModule,
    RepairRequestImageModule,
    RepairWarrantyPolicyModule,
    RepairInvoiceItemModule,
    RepairServiceModule,
    NotificationModule,
    StaffActionLogModule,
    forwardRef(() => UserModule),
  ],
  controllers: [RepairRequestController],
  providers: [RepairRequestService, RepairRequestRepository],
  exports: [RepairRequestRepository],
})
export class RepairRequestModule {}
