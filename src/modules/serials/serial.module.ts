import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Serial, SerialSchema } from './serial.entity';
import { SerialController } from './serial.controller';
import { SerialService } from './serial.service';
import { SerialRepository } from './serial.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Serial.name, schema: SerialSchema }]),
  ],
  controllers: [SerialController],
  providers: [SerialService, SerialRepository],
  exports: [SerialService, SerialRepository],
})
export class SerialModule {}
