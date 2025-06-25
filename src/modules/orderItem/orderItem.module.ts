import { Module } from '@nestjs/common';
import { OrderItemController } from './orderItem.controller';
import { OrderItem, OrderItemSchema } from './orderItem.entity';
import { OrderItemRepository } from './orderItem.repository';
import { OrderItemService } from './orderItem.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductImageModule } from '../productImage/productImage.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderItem.name, schema: OrderItemSchema },
    ]),
    ProductImageModule,
  ],
  providers: [OrderItemService, OrderItemRepository],
  controllers: [OrderItemController],
  exports: [OrderItemRepository, OrderItemService],
})
export class OrderItemModule {}
