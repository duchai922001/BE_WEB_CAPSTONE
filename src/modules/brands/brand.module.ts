import { forwardRef, Module } from '@nestjs/common';
import { Brand, BrandSchema } from './brand.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandService } from './brand.service';
import { BrandRepository } from './brand.repository';
import { BrandController } from './brand.controller';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
    forwardRef(() => ProductModule),
  ],
  providers: [BrandService, BrandRepository],
  controllers: [BrandController],
  exports: [BrandRepository],
})
export class BrandModule {}
