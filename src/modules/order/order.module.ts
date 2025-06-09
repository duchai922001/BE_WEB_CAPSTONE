import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, OrderSchema } from "./order.entity";
import { OrderService } from "./order.service";
import { OrderRepository } from "./order.repository";
import { OrderController } from "./order.controller";

@Module({
    imports:[
        MongooseModule.forFeature([
            { name: Order.name, schema: OrderSchema},
        ]),
    ],
    providers: [OrderService, OrderRepository],
    controllers: [OrderController],
    exports: [OrderRepository, OrderService],
})
export class OrderModule{}