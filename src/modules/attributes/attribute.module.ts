import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Attribute, AttributeSchema } from './attribute.entity';
import { AttributeController } from './attribute.controller';
import { AttributeService } from './attribute.service';
import { AttributeRepository } from './attribute.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attribute.name, schema: AttributeSchema },
    ]),
  ],
  controllers: [AttributeController],
  providers: [AttributeService, AttributeRepository],
  exports: [AttributeService],
})
export class AttributeModule {}
