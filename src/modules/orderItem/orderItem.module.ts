import { Module } from '@nestjs/common';
import { OrderItemController } from './orderItem.controller';
import { OrderItem, OrderItemSchema } from './orderItem.entity';
import { OrderItemRepository } from './orderItem.repository';
import { OrderItemService } from './orderItem.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderItem.name, schema: OrderItemSchema },
    ]),
  ],
  providers: [OrderItemService, OrderItemRepository],
  controllers: [OrderItemController],
  exports: [OrderItemRepository],
})
export class OrderItemModule {}
