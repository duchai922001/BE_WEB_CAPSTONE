import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.entity';
import { VariableModule } from '../variables/variable.module';
import { ProductService } from './product.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    VariableModule,
  ],
  providers: [ProductRepository, ProductService],
  exports: [ProductRepository],
  controllers: [ProductController],
})
export class ProductModule {}
