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
import { CartItemModule } from '../cartItem/cartItem.module';
import { ProductImageModule } from '../productImage/productImage.module';
import { UserModule } from '../users/user.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InstalmentRequest.name, schema: InstalmentRequestSchema },
    ]),
    AttributeModule,
    PromotionModule,
    CartItemModule,
    NotificationModule,
    ProductImageModule,
    UserModule,
  ],
  controllers: [InstalmentRequestController],
  providers: [InstalmentRequestService, InstalmentRequestRepository],
  exports: [InstalmentRequestService],
})
export class InstalmentRequestModule {}
