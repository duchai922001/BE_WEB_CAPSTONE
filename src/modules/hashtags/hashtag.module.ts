import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HashTag, HashTagSchema } from './hashtag.entity';
import { HashTagController } from './hashtag.controller';
import { HashTagService } from './hashtag.service';
import { HashTagRepository } from './hashtag.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: HashTag.name, schema: HashTagSchema }]),
  ],
  controllers: [HashTagController],
  providers: [HashTagService, HashTagRepository],
  exports: [HashTagService],
})
export class HashTagModule {}
