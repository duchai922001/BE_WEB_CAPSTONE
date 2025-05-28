import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InstalmentRequest,
  InstalmentRequestSchema,
} from './instalmentRequest.entity';
import { InstalmentRequestController } from './instalmentRequest.controller';
import { InstalmentRequestService } from './instalmentRequest.service';
import { InstalmentRequestRepository } from './instalmentRequest.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InstalmentRequest.name, schema: InstalmentRequestSchema },
    ]),
  ],
  controllers: [InstalmentRequestController],
  providers: [InstalmentRequestService, InstalmentRequestRepository],
  exports: [InstalmentRequestService],
})
export class InstalmentRequestModule {}
