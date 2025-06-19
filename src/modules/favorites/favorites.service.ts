import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFavoriteDto } from './dtos/create.dto';
import { FavoriteRepository } from './favorites.repository';

@Injectable()
export class FavoriteService {
  constructor(private readonly repo: FavoriteRepository) {}

  async addFavorite(dto: CreateFavoriteDto) {
    const existed = await this.repo.findOne(dto.userId, dto.productId);
    if (existed) return existed;
    return this.repo.create(dto);
  }

  getFavoritesByUser(userId: string) {
    return this.repo.findAllByUser(userId);
  }

  async removeFavorite(id: string) {
    const deleted = await this.repo.remove(id);
    if (!deleted) throw new NotFoundException('Favorite not found');
    return deleted;
  }
}
