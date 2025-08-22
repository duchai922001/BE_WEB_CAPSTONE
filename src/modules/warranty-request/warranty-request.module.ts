import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WarrantyRequestService } from './warranty-request.service';
import { WarrantyRequestController } from './warranty-request.controller';
import {
  WarrantyRequest,
  WarrantyRequestSchema,
} from './warranty-request.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WarrantyRequest.name, schema: WarrantyRequestSchema },
    ]),
  ],
  controllers: [WarrantyRequestController],
  providers: [WarrantyRequestService],
  exports: [WarrantyRequestService],
})
export class WarrantyRequestModule {}
