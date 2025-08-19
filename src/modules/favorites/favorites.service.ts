import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFavoriteDto } from './dtos/create.dto';
import { FavoriteRepository } from './favorites.repository';
import { ProductImageRepository } from '../productImage/productImage.repository';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly repo: FavoriteRepository,
    private readonly productImageRepo: ProductImageRepository,
  ) {}

  async addFavorite(dto: CreateFavoriteDto) {
    const existed = await this.repo.findOne(dto.userId, dto.productId);
    if (existed) return existed;
    return this.repo.create(dto);
  }

  async getFavoritesByUser(userId: string) {
    const favorites = await this.repo.findAllByUser(userId);

    const productIds = favorites.map((fav) => fav.productId._id.toString());

    const defaultImages =
      await this.productImageRepo.findDefaultByProductIds(productIds);

    const imageMap = new Map(
      defaultImages.map((img) => [img.productId.toString(), img.url]),
    );

    return favorites.map((fav) => ({
      ...fav.toObject(),
      image: imageMap.get(fav.productId._id.toString()) || null,
    }));
  }

  async removeFavorite(id: string) {
    const deleted = await this.repo.remove(id);
    if (!deleted) throw new NotFoundException('Favorite not found');
    return deleted;
  }
}
