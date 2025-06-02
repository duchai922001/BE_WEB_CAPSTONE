import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Address, AddressSchema } from './address.entity';
import { AddressRepository } from './address.repository';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }]),
  ],
  providers: [AddressRepository, AddressService],
  exports: [],
  controllers: [AddressController],
})
export class AddressModule {}
