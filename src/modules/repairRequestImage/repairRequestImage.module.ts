import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RepairRequestImageController } from './repairRequestImage.controller';
import { RepairRequestImageService } from './repairRequestImage.service';
import { RepairRequestImageRepository } from './repairRequestImage.repository';
import {
  RepairRequestImage,
  RepairRequestImageSchema,
} from './repairRequestImage.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RepairRequestImage.name, schema: RepairRequestImageSchema },
    ]),
  ],
  controllers: [RepairRequestImageController],
  providers: [RepairRequestImageService, RepairRequestImageRepository],
  exports: [RepairRequestImageService],
})
export class RepairRequestImageModule {}
