import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstalmentCart, InstalmentCartSchema } from './instalmentCart.entity';
import { InstalmentCartController } from './instalmentCart.controller';
import { InstalmentCartService } from './instalmentCart.service';
import { InstalmentCartRepository } from './instalmentCart.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InstalmentCart.name, schema: InstalmentCartSchema },
    ]),
  ],
  controllers: [InstalmentCartController],
  providers: [InstalmentCartService, InstalmentCartRepository],
})
export class InstalmentCartModule {}
