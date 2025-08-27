import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Variable, VariableSchema } from './variable.entity';
import { VariableRepository } from './variable.repository';
import { VariableService } from './variable.service';
import { VariableController } from './variable.controller';
import { SerialModule } from '../serials/serial.module';
import { AttributeModule } from '../attributes/attribute.module';
import { Attribute, AttributeSchema } from '../attributes/attribute.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Variable.name, schema: VariableSchema },
      { name: Attribute.name, schema: AttributeSchema },
    ]),
    SerialModule,
    AttributeModule,
    forwardRef(() => ProductModule),
  ],
  providers: [VariableRepository, VariableService],
  exports: [VariableService, VariableRepository],
  controllers: [VariableController],
})
export class VariableModule {}
