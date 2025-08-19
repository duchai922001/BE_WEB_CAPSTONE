import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Favorite, FavoriteSchema } from './favorites.entity';
import { FavoriteController } from './favorites.controller';
import { FavoriteService } from './favorites.service';
import { FavoriteRepository } from './favorites.repository';
import { ProductImageModule } from '../productImage/productImage.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Favorite.name, schema: FavoriteSchema },
    ]),
    ProductImageModule,
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService, FavoriteRepository],
})
export class FavoriteModule {}
