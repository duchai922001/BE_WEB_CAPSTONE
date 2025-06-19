import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstalmentCart, InstalmentCartSchema } from './instalmentCart.entity';
import { InstalmentCartController } from './instalmentCart.controller';
import { InstalmentCartService } from './instalmentCart.service';
import { InstalmentCartRepository } from './instalmentCart.repository';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InstalmentCart.name, schema: InstalmentCartSchema },
    ]),
    ProductModule,
  ],
  controllers: [InstalmentCartController],
  providers: [InstalmentCartService, InstalmentCartRepository],
  exports: [InstalmentCartRepository],
})
export class InstalmentCartModule {}
