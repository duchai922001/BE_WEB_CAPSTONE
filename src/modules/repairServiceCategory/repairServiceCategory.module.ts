import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RepairServiceCategory,
  RepairServiceCategorySchema,
} from './repairServiceCategory.entity';
import { RepairServiceCategoryService } from './repairServiceCategory.service';
import { RepairServiceCategoryController } from './repairServiceCategory.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RepairServiceCategory.name,
        schema: RepairServiceCategorySchema,
      },
    ]),
  ],
  providers: [RepairServiceCategoryService],
  controllers: [RepairServiceCategoryController],
  exports: [RepairServiceCategoryService],
})
export class RepairServiceCategoryModule {}
