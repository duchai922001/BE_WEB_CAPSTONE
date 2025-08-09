import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpecificationsKeyDto } from './dto/create-specifications-key.dto';
import { UpdateSpecificationsKeyDto } from './dto/update-specifications-key.dto';
import { SpecificationsKeyRepository } from './specifications-key.repository';
import { ResponseMessage } from 'src/common/enums/responseMessage';

@Injectable()
export class SpecificationsKeyService {
  constructor(private readonly repo: SpecificationsKeyRepository) {}

  create(dto: CreateSpecificationsKeyDto) {
    return this.repo.create(dto);
  }

  findAll() {
    return this.repo.findAll();
  }

  async findOne(id: string) {
    const item = await this.repo.findOne(id);
    if (!item) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return item;
  }

  update(id: string, dto: UpdateSpecificationsKeyDto) {
    return this.repo.update(id, dto);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
