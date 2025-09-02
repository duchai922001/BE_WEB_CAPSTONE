import { forwardRef, Module } from '@nestjs/common';
import { CartItemController } from './cartItem.controller';
import { CartItem, CartItemSchema } from './cartItem.entity';
import { CartItemRepository } from './cartItem.repository';
import { CartItemService } from './cartItem.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CartItem.name, schema: CartItemSchema },
    ]),
    forwardRef(() => CartModule),
  ],
  providers: [CartItemService, CartItemRepository],
  controllers: [CartItemController],
  exports: [CartItemRepository],
})
export class CartItemModule {}
