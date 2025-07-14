import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Specifications, SpecificationsSchema } from './specifications.entity';
import { SpecificationsController } from './specifications.controller';
import { SpecificationsService } from './specifications.service';
import { SpecificationsRepository } from './specifications.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Specifications.name, schema: SpecificationsSchema },
    ]),
  ],
  controllers: [SpecificationsController],
  providers: [SpecificationsService, SpecificationsRepository],
})
export class SpecificationsModule {}
