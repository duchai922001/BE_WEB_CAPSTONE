import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttributeDto } from './dtos/create.dto';
import { AttributeRepository } from './attribute.repository';
import { ResponseMessage } from 'src/common/enums/responseMessage';

@Injectable()
export class AttributeService {
  constructor(private readonly attributeRepository: AttributeRepository) {}

  async create(dto: CreateAttributeDto) {
    return this.attributeRepository.create(dto);
  }

  async findAll() {
    return this.attributeRepository.findAll();
  }

  async findById(id: string) {
    const serial = await this.attributeRepository.findById(id);
    if (!serial) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return serial;
  }
}
