import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecificationsKeyService } from './specifications-key.service';
import { SpecificationsKeyRepository } from './specifications-key.repository';
import { SpecificationsKeyController } from './specifications-key.controller';
import {
  SpecificationsKey,
  SpecificationsKeySchema,
} from './specifications-key.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SpecificationsKey.name, schema: SpecificationsKeySchema },
    ]),
  ],
  controllers: [SpecificationsKeyController],
  providers: [SpecificationsKeyService, SpecificationsKeyRepository],
})
export class SpecificationsKeyModule {}
