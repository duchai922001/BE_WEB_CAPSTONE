import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomSlideService } from './custom-slide.service';
import { CustomSlideController } from './custom-slide.controller';
import { CustomSlide, CustomSlideSchema } from './custom-slide.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CustomSlide.name, schema: CustomSlideSchema },
    ]),
  ],
  controllers: [CustomSlideController],
  providers: [CustomSlideService],
})
export class CustomSlideModule {}
