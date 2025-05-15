import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Variable, VariableSchema } from './variable.entity';
import { VariableRepository } from './variable.repository';
import { VariableService } from './variable.service';
import { VariableController } from './variable.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Variable.name, schema: VariableSchema },
    ]),
  ],
  providers: [VariableRepository, VariableService],
  exports: [VariableRepository],
  controllers: [VariableController],
})
export class VariableModule {}
