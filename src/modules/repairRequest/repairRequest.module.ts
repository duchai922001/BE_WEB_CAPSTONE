import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RepairRequest, RepairRequestSchema } from './repairRequest.entity';
import { RepairRequestController } from './repairRequest.controller';
import { RepairRequestService } from './repairRequest.service';
import { RepairRequestRepository } from './repairRequest.repository';
import { RepairRequestServiceModule } from '../repairRequestService/repairRequestService.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RepairRequest.name, schema: RepairRequestSchema },
    ]),
    RepairRequestServiceModule,
  ],
  controllers: [RepairRequestController],
  providers: [RepairRequestService, RepairRequestRepository],
})
export class RepairRequestModule {}
