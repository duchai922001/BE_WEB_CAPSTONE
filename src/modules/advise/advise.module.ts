import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Advise, AdviseSchema } from './advise.entity';
import { AdviseService } from './advise.service';
import { AdviseGateway } from './advise.gateway';
import { AdviseRepository } from './advise.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Advise.name, schema: AdviseSchema }]),
  ],
  providers: [AdviseService, AdviseGateway, AdviseRepository],
})
export class AdviseModule {}
