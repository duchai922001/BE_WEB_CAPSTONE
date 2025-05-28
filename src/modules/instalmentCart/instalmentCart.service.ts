import { Injectable, NotFoundException } from '@nestjs/common';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { CreateInstalmentCartDto } from './dtos/create.dto';
import { InstalmentCartRepository } from './instalmentCart.repository';

@Injectable()
export class InstalmentCartService {
  constructor(
    private readonly instalmentCartRepository: InstalmentCartRepository,
  ) {}

  async create(dto: CreateInstalmentCartDto) {
    return this.instalmentCartRepository.create(dto);
  }

  async findByUserId(userId: string) {
    const cart = await this.instalmentCartRepository.findByUserId(userId);
    if (!cart) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return cart;
  }

  async updateStatus(id: string, status: boolean) {
    const updated = await this.instalmentCartRepository.updateStatus(
      id,
      status,
    );
    if (!updated) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return updated;
  }

  async findAll() {
    return this.instalmentCartRepository.findAll();
  }
}
