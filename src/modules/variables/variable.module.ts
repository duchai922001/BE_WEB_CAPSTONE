import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Variable, VariableSchema } from './variable.entity';
import { VariableRepository } from './variable.repository';
import { VariableService } from './variable.service';
import { VariableController } from './variable.controller';
import { SerialModule } from '../serials/serial.module';
import { AttributeModule } from '../attributes/attribute.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Variable.name, schema: VariableSchema },
    ]),
    SerialModule,
    AttributeModule,
  ],
  providers: [VariableRepository, VariableService],
  exports: [VariableRepository],
  controllers: [VariableController],
})
export class VariableModule {}
