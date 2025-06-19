import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Favorite, FavoriteDocument } from './favorites.entity';
import { CreateFavoriteDto } from './dtos/create.dto';

export class FavoriteRepository {
  constructor(
    @InjectModel(Favorite.name)
    private readonly favoriteModel: Model<FavoriteDocument>,
  ) {}

  create(data: CreateFavoriteDto) {
    return this.favoriteModel.create(data);
  }

  findAllByUser(userId: string) {
    return this.favoriteModel.find({ userId }).populate('productId').exec();
  }

  findOne(userId: string, productId: string) {
    return this.favoriteModel.findOne({ userId, productId }).exec();
  }

  remove(id: string) {
    return this.favoriteModel.findByIdAndDelete(id).exec();
  }
}
