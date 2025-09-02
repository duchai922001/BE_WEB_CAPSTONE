import { Module } from '@nestjs/common';
import { OrderItemController } from './orderItem.controller';
import { OrderItem, OrderItemSchema } from './orderItem.entity';
import { OrderItemRepository } from './orderItem.repository';
import { OrderItemService } from './orderItem.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductImageModule } from '../productImage/productImage.module';
import { VariableModule } from '../variables/variable.module';
import { PromotionModule } from '../promotion/promotion.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderItem.name, schema: OrderItemSchema },
    ]),
    ProductImageModule,
    VariableModule,
    PromotionModule,
  ],
  providers: [OrderItemService, OrderItemRepository],
  controllers: [OrderItemController],
  exports: [OrderItemRepository, OrderItemService],
})
export class OrderItemModule {}
