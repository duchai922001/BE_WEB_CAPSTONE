import { Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { CreateCartDto } from './dtos/create-cart.dto';
import { ProductRepository } from '../product/product.repository';
import { InstalmentCartRepository } from '../instalmentCart/instalmentCart.repository';
import { InstalmentItemRepository } from '../instalmentItem/instalmentItem.repository';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { CartItemRepository } from '../cartItem/cartItem.repository';
import { ProductImageRepository } from '../productImage/productImage.repository';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepo: CartRepository,
    private readonly cartItemRepo: CartItemRepository,
    private readonly productRepo: ProductRepository,
    private readonly instalmentCartRepo: InstalmentCartRepository,
    private readonly instalmentItemRepo: InstalmentItemRepository,
    private readonly productImageRepo: ProductImageRepository,
  ) {}

  async create(dto: CreateCartDto) {
    return this.cartRepo.create(dto);
  }

  async findAll() {
    return this.cartRepo.findAll();
  }

  async findById(id: string) {
    const cart = await this.cartRepo.findById(id);
    if (!cart) throw new NotFoundException('Không tìm thấy cart');
    return cart;
  }

  async delete(id: string) {
    const ok = await this.cartRepo.delete(id);
    if (!ok) throw new NotFoundException('Không thể xoá cart');
  }

  async addToCart(
    userId: string,
    productId: string,
    quantity = 1,
    variableId?: string,
  ) {
    const product = await this.productRepo.findById(productId);
    if (!product) {
      throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    }
    const cart = await this.cartRepo.getOrCreateCart(userId);
    await this.cartItemRepo.addItem(
      (cart as any)._id.toString(),
      productId,
      quantity,
      variableId,
    );

    if (product.isInstallment) {
      const instalmentCart =
        await this.instalmentCartRepo.getOrCreateInstalmentCart(userId);
      await this.instalmentItemRepo.addItem(
        (instalmentCart as any)._id.toString(),
        productId,
        variableId,
      );
    }

    return { message: 'Thêm sản phẩm vào giỏ hàng thành công' };
  }

  async getCartItems(userId: string) {
    const cart = await this.cartRepo.getOrCreateCart(userId);
    const items = await this.cartItemRepo.getItems(
      (cart as any)._id.toString(),
    );

    const result = await Promise.all(
      items.map(async (item) => {
        const productId = item.productId._id.toString();

        const defaultImage =
          await this.productImageRepo.findDefaultImageByProductId(productId);

        return {
          ...item.toObject(),
          image: defaultImage?.url || null,
        };
      }),
    );

    return result;
  }

  async getInstalmentItems(userId: string) {
    const cart =
      await this.instalmentCartRepo.getOrCreateInstalmentCart(userId);
    const items = await this.instalmentItemRepo.getItems(
      (cart as any)._id.toString(),
    );

    const result = await Promise.all(
      items.map(async (item) => {
        const productId =
          item.productId._id?.toString?.() || item.productId.toString();

        const defaultImage =
          await this.productImageRepo.findDefaultImageByProductId(productId);

        return {
          ...item.toObject(),
          image: defaultImage?.url || null,
        };
      }),
    );

    return result;
  }
}
