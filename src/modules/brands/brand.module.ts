import { Module } from '@nestjs/common';
import { Brand, BrandSchema } from './brand.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandService } from './brand.service';
import { BrandRepository } from './brand.repository';
import { BrandController } from './brand.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
  ],
  providers: [BrandService, BrandRepository],
  controllers: [BrandController],
  exports: [BrandRepository],
})
export class BrandModule {}
