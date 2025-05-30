import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromotionImage, PromotionImageSchema } from './promotionImage.entity';
import { PromotionImageRepository } from './promotionImage.repository';
import { PromotionImageService } from './promotionImage.service';
import { PromotionImageController } from './promotionImage.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PromotionImage.name, schema: PromotionImageSchema },
    ]),
  ],
  providers: [PromotionImageRepository, PromotionImageService],
  exports: [],
  controllers: [PromotionImageController],
})
export class PromotionImageModule {}
