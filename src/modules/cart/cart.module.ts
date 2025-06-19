import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './cart.entity';
import { CartRepository } from './cart.repository';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { InstalmentItemModule } from '../instalmentItem/instalmentItem.module';
import { InstalmentCartModule } from '../instalmentCart/instalmentCart.module';
import { CartItemModule } from '../cartItem/cartItem.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    InstalmentItemModule,
    InstalmentCartModule,
    CartItemModule,
    ProductModule,
  ],
  providers: [CartRepository, CartService],
  controllers: [CartController],
  exports: [CartRepository, CartService],
})
export class CartModule {}
