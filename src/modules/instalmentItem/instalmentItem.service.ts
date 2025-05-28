import { Injectable, NotFoundException } from '@nestjs/common';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { CreateInstalmentItemDto } from './dtos/create.dto';
import { InstalmentItemRepository } from './instalmentItem.repository';

@Injectable()
export class InstalmentItemService {
  constructor(private readonly repo: InstalmentItemRepository) {}

  async create(dto: CreateInstalmentItemDto) {
    return this.repo.create(dto);
  }

  async findAll() {
    return this.repo.findAll();
  }

  async findById(id: string) {
    const item = await this.repo.findById(id);
    if (!item) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return item;
  }

  async updateStatus(id: string, status: boolean) {
    const item = await this.repo.updateStatus(id, status);
    if (!item) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return item;
  }

  async delete(id: string) {
    await this.repo.delete(id);
    return { message: 'Deleted successfully' };
  }
}
