import { Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { CreateCartDto } from './dtos/create-cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  async create(dto: CreateCartDto) {
    return this.cartRepository.create(dto);
  }

  async findAll(){
    return this.cartRepository.findAll();
  }

  async findById(id: string){
    const cart = await this.cartRepository.findById(id);
    if(!cart) throw new NotFoundException('Không tìm thấy cart');
    return cart;
  }

  async delete(id: string){
    const ok = await this.cartRepository.delete(id);
    if(!ok) throw new NotFoundException('Không thể xoá cart');
  }
}
