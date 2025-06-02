import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstalmentItem, InstalmentItemSchema } from './instalmentItem.entity';
import { InstalmentItemController } from './instalmentItem.controller';
import { InstalmentItemService } from './instalmentItem.service';
import { InstalmentItemRepository } from './instalmentItem.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InstalmentItem.name, schema: InstalmentItemSchema },
    ]),
  ],
  controllers: [InstalmentItemController],
  providers: [InstalmentItemService, InstalmentItemRepository],
})
export class InstalmentItemModule {}
