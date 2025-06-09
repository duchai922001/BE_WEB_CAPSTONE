import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Cart, CartSchema } from "./cart.entity";
import { CartRepository } from "./cart.repository";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ],
    providers: [CartRepository, CartService],
    controllers: [CartController],
    exports: [CartRepository, CartService],
})
export class CartModule{}