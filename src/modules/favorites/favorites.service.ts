import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFavoriteDto } from './dtos/create.dto';
import { FavoriteRepository } from './favorites.repository';
import { ProductImageRepository } from '../productImage/productImage.repository';
import { PromotionRepository } from '../promotion/promotion.repository';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly repo: FavoriteRepository,
    private readonly productImageRepo: ProductImageRepository,
    private readonly promotionRepo: PromotionRepository,
  ) {}

  async addFavorite(dto: CreateFavoriteDto) {
    const existed = await this.repo.findOne(dto.userId, dto.productId);
    if (existed) return existed;
    return this.repo.create(dto);
  }

  async getFavoritesByUser(userId: string) {
    // Lấy danh sách favorites
    const favorites = await this.repo.findAllByUser(userId);

    const productIds = favorites.map((fav) => fav.productId._id.toString());

    // Lấy ảnh mặc định
    const defaultImages =
      await this.productImageRepo.findDefaultByProductIds(productIds);
    const imageMap = new Map(
      defaultImages.map((img) => [img.productId.toString(), img.url]),
    );

    // Lấy khuyến mãi
    const { promos, defaultPromo } =
      await this.promotionRepo.findValidByProductIds(productIds);

    const promotionMap: Record<
      string,
      { discountValue: number; discountType: string; maxDiscountMoney?: number }
    > = {};

    for (const promo of promos) {
      for (const pid of promo.products) {
        promotionMap[pid.toString()] = {
          discountValue: promo.discountValue,
          discountType: promo.discountType,
          maxDiscountMoney: promo.maxDiscountMoney ?? null,
        };
      }
    }

    // Map dữ liệu trả về
    return favorites.map((fav) => {
      const p = fav.productId as any; // product populate từ Favorite
      const promo =
        promotionMap[p._id.toString()] ||
        (defaultPromo
          ? {
              discountValue: defaultPromo.discountValue,
              discountType: defaultPromo.discountType,
              maxDiscountMoney: defaultPromo.maxDiscountMoney ?? null,
            }
          : null);

      return {
        favoriteId: fav._id,
        _id: p._id,
        name: p.name,
        sellPrice: p.sellPrice,
        image: imageMap.get(p._id.toString()) || null,
        isInstallment: p.isInstallment,
        isPromotion: !!promo,
        salePrice: p.salePrice,
        discountValue: promo?.discountValue ?? null,
        discountType: promo?.discountType ?? null,
        maxDiscountMoney: promo?.maxDiscountMoney ?? null,
        isInStock: p.stock > 0,
      };
    });
  }

  async removeFavorite(id: string) {
    const deleted = await this.repo.remove(id);
    if (!deleted) throw new NotFoundException('Favorite not found');
    return deleted;
  }
}
