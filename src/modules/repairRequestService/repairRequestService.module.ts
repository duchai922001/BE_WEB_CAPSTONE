import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RepairRequestService,
  RepairRequestServiceSchema,
} from './repairRequestServicve.entity';
import { RepairServiceModule } from '../repairService/repairService.module';
import { RepairRequestServiceController } from './repairRequestService.controller';
import { RepairRequestServiceReprository } from './repairRequestService.repository';
import { RepairRequestServiceService } from './repairRequestService.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RepairRequestService.name, schema: RepairRequestServiceSchema },
    ]),
    RepairServiceModule,
  ],
  providers: [RepairRequestServiceService, RepairRequestServiceReprository],
  controllers: [RepairRequestServiceController],
  exports: [RepairRequestServiceReprository, RepairRequestServiceService],
})
export class RepairRequestServiceModule {}
