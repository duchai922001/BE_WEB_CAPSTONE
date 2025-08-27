import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InstalmentRequest,
  InstalmentRequestSchema,
} from './instalmentRequest.entity';
import { InstalmentRequestController } from './instalmentRequest.controller';
import { InstalmentRequestService } from './instalmentRequest.service';
import { InstalmentRequestRepository } from './instalmentRequest.repository';
import { AttributeModule } from '../attributes/attribute.module';
import { PromotionModule } from '../promotion/promotion.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InstalmentRequest.name, schema: InstalmentRequestSchema },
    ]),
    AttributeModule,
    PromotionModule,
  ],
  controllers: [InstalmentRequestController],
  providers: [InstalmentRequestService, InstalmentRequestRepository],
  exports: [InstalmentRequestService],
})
export class InstalmentRequestModule {}
