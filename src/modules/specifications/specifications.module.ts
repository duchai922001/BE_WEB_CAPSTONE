import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Specifications, SpecificationsSchema } from './specifications.entity';
import { SpecificationsController } from './specifications.controller';
import { SpecificationsService } from './specifications.service';
import { SpecificationsRepository } from './specifications.repository';
import {
  SpecificationsKey,
  SpecificationsKeySchema,
} from '../specifications-key/specifications-key.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Specifications.name, schema: SpecificationsSchema },
      { name: SpecificationsKey.name, schema: SpecificationsKeySchema },
    ]),
  ],
  controllers: [SpecificationsController],
  providers: [SpecificationsService, SpecificationsRepository],
  exports: [SpecificationsService],
})
export class SpecificationsModule {}
