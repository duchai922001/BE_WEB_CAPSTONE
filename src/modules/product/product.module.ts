import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SerialModule } from '../serials/serial.module';
import { Product, ProductSchema } from './product.entity';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductImageModule } from '../productImage/productImage.module';
import { VariableModule } from '../variables/variable.module';
import { CategoryModule } from '../categories/category.module';
import { BrandModule } from '../brands/brand.module';
import { Brand, BrandSchema } from '../brands/brand.entity';
import { SpecificationsModule } from '../specifications/specifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Brand.name, schema: BrandSchema },
    ]),
    SerialModule,
    ProductImageModule,
    VariableModule,
    CategoryModule,
    SpecificationsModule,
    forwardRef(() => BrandModule),
  ],
  providers: [ProductRepository, ProductService],
  controllers: [ProductController],
  exports: [ProductRepository],
})
export class ProductModule {}
