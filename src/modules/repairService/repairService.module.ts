import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RepairServiceController } from './repairService.controller';
import { RepairRequestImageService } from '../repairRequestImage/repairRequestImage.service';
import { RepairServiceService } from './repairService.service';
import { RepairServiceRepository } from './repairService.repository';
import { RepairService, RepairServiceSchema } from './repairService.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RepairService.name, schema: RepairServiceSchema },
    ]),
  ],
  controllers: [RepairServiceController],
  providers: [RepairRequestImageService, RepairServiceRepository],
  exports: [RepairServiceService],
})
export class RepairRequestImageModule {}
