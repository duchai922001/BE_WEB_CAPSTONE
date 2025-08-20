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
import { ProductImageModule } from '../productImage/productImage.module';
import { Attribute, AttributeSchema } from '../attributes/attribute.entity';
import { PromotionModule } from '../promotion/promotion.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Attribute.name, schema: AttributeSchema },
    ]),
    InstalmentItemModule,
    InstalmentCartModule,
    CartItemModule,
    ProductModule,
    ProductImageModule,
    PromotionModule,
  ],
  providers: [CartRepository, CartService],
  controllers: [CartController],
  exports: [CartRepository, CartService],
})
export class CartModule {}
