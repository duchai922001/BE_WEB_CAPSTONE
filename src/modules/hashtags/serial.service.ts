import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSerialDto } from './dtos/create.dto';
import { SerialRepository } from './serial.repository';
import { ResponseMessage } from 'src/common/enums/responseMessage';

@Injectable()
export class SerialService {
  constructor(private readonly serialRepository: SerialRepository) {}

  async create(dto: CreateSerialDto) {
    return this.serialRepository.create(dto);
  }

  async findAll() {
    return this.serialRepository.findAll();
  }

  async findById(id: string) {
    const serial = await this.serialRepository.findById(id);
    if (!serial) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return serial;
  }
}
