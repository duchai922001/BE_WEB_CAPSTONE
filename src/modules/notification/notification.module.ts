import { NotificationController } from './notification.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification.entity';
import { NotificationRepository } from './notification.repository';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  providers: [NotificationRepository, NotificationService, NotificationGateway],
  controllers: [NotificationController],
  exports: [NotificationGateway, NotificationService],
})
export class NotificationModule {}
