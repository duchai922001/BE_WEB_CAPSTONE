import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StaffActionLog, StaffActionLogSchema } from './staffActionLog.entity';
import { StaffActionLogController } from './staffActionLog.controller';
import { StaffActionLogService } from './staffActionLog.service';
import { StaffActionLogRepository } from './staffActionLog.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StaffActionLog.name, schema: StaffActionLogSchema },
    ]),
  ],
  controllers: [StaffActionLogController],
  providers: [StaffActionLogService, StaffActionLogRepository],
  exports: [StaffActionLogService],
})
export class StaffActionLogModule {}
