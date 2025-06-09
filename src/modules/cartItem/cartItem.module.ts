import { Module } from "@nestjs/common";
import { CartItemController } from "./cartItem.controller";
import { CartItem, CartItemSchema } from "./cartItem.entity";
import { CartItemRepository } from "./cartItem.repository";
import { CartItemService } from "./cartItem.service";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CartItem.name, schema: CartItemSchema },
    ]),
  ],
  providers: [CartItemService, CartItemRepository],
  controllers: [CartItemController],
})
export class CartItemModule {}