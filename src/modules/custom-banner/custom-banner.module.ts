import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomBanner, CustomBannerSchema } from './custom-banner.schema';
import { CustomBannerController } from './custom-banner.controller';
import { CustomBannerService } from './custom-banner.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CustomBanner.name, schema: CustomBannerSchema },
    ]),
  ],
  controllers: [CustomBannerController],
  providers: [CustomBannerService],
})
export class CustomBannerModule {}
