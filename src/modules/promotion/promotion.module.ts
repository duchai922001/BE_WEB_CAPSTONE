import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromotionController } from './promotion.controller';
import { PromotionService } from './promotion.service';
import { PromotionRepository } from './promotion.repository';
import { Promotion, PromotionSchema } from './promotion.entity';
import { PromotionImageModule } from '../promotionImage/promotionImage.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Promotion.name, schema: PromotionSchema },
    ]),
    PromotionImageModule,
    ProductModule,
  ],
  controllers: [PromotionController],
  providers: [PromotionService, PromotionRepository],
  exports: [PromotionService],
})
export class PromotionModule {}
