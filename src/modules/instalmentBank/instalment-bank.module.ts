import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstalmentBank, InstalmentBankSchema } from './instalment-bank.entity';
import { InstalmentBankRepository } from './instalment-bank.repository';
import { InstalmentBankController } from './instalment-bank.controller';
import { InstalmentBankService } from './instalment-bank.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InstalmentBank.name, schema: InstalmentBankSchema },
    ]),
  ],
  controllers: [InstalmentBankController],
  providers: [InstalmentBankService, InstalmentBankRepository],
  exports: [InstalmentBankService],
})
export class InstalmentBankModule {}
