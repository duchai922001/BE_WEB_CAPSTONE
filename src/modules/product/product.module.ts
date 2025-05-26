import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SerialModule } from '../serials/serial.module';
import { Product, ProductSchema } from './product.entity';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductImageModule } from '../productImage/productImage.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    SerialModule,
    ProductImageModule,
  ],
  providers: [ProductRepository, ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
