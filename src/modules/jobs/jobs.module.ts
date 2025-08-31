import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../users/user.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [ConfigModule, ProductModule, UserModule, NotificationModule],
  providers: [JobsService],
})
export class JobsModule {}
