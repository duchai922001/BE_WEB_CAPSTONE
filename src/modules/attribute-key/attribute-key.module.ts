import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttributeKey, AttributeKeySchema } from './attribute-key.entity';
import { AttributeKeyController } from './attribute-key.controller';
import { AttributeKeyService } from './attribute-key.service';
import { AttributeKeyRepository } from './attribute-key.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AttributeKey.name, schema: AttributeKeySchema },
    ]),
  ],
  controllers: [AttributeKeyController],
  providers: [AttributeKeyService, AttributeKeyRepository],
  exports: [AttributeKeyService],
})
export class AttributeKeyModule {}
