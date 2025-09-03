import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { Order, OrderSchema } from '../order/order.entity';
import {
  RepairRequest,
  RepairRequestSchema,
} from '../repairRequest/repairRequest.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: RepairRequest.name, schema: RepairRequestSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
