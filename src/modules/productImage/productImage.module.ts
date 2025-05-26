import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductImage, ProductImageSchema } from './productImage.entity';
import { ProductImageController } from './productImage.controller';
import { ProductImageService } from './productImage.service';
import { ProductImageRepository } from './productImage.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductImage.name, schema: ProductImageSchema },
    ]),
  ],
  controllers: [ProductImageController],
  providers: [ProductImageService, ProductImageRepository],
  exports: [ProductImageService],
})
export class ProductImageModule {}
