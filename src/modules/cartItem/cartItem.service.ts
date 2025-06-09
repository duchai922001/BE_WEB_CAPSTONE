import { Injectable, NotFoundException } from '@nestjs/common';
import { CartItemRepository } from './cartItem.repository';
import { CreateCartItemDto } from './dtos/create-cartItem';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';

@Injectable()
export class CartItemService {
  constructor(private readonly cartItemRepository: CartItemRepository) {}

  async create(dto: CreateCartItemDto) {
    return await this.cartItemRepository.create(dto);
  }

  async findAll(query: BaseQueryDto) {
    return await this.cartItemRepository.findAll(query);
  }

  async findById(id: string) {
    const cartItem = await this.cartItemRepository.findById(id);
    if (!cartItem) throw new NotFoundException('Không tìm thấy cartItem');
    return cartItem;
  }

  async softDelete(id: string){
    const cartItem = await this.cartItemRepository.findById(id);
    if (!cartItem) throw new NotFoundException('Không tìm thấy cartItem');
    return this.cartItemRepository.softDelete(id);
  }

  async incrementQuantity(id: string, delta: number){
    const cartItem = await this.cartItemRepository.findById(id);
    if (!cartItem) throw new NotFoundException('Không tìm thấy cartItem');
    return this.cartItemRepository.incrementQuantity(id, delta);
  }

  async delete(id: string) {
    const ok = await this.cartItemRepository.delete(id);
    if (!ok) throw new NotFoundException('Không thể xóa cartItem');
  }
}
