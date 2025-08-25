import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSerialDto } from './dtos/create.dto';
import { SerialRepository } from './serial.repository';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { ClientSession } from 'mongoose';

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
  async findByProductId(productId: string) {
    return this.serialRepository.findSerialNotSoldByProductId(productId);
  }
  async findByVariableId(variableId: string) {
    return this.serialRepository.findByVariableId(variableId);
  }

  async deleteById(id: string) {
    await this.serialRepository.deleteById(id);
  }

  async deleteByProductId(productId: string) {
    await this.serialRepository.deleteByProductId(productId);
  }

  async updateById(id: string, dto: any, session?: ClientSession) {
    const serial = await this.serialRepository.updateById(id, dto, session);
    if (!serial) {
      throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    }
    return serial;
  }

  async updateBySerialCode(id: string, dto: any) {
    const serial = await this.serialRepository.updateBySerialCode(id, dto);
    if (!serial) {
      throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    }
    return serial;
  }

  async deleteManyByIds(ids: string[]) {
    if (!ids || ids.length === 0) {
      throw new BadRequestException(ResponseMessage.REQUIRED_FIELD + ' ids');
    }
    return this.serialRepository.deleteManyByIds(ids);
  }

  async find(condition: any, limit?: number, session?: ClientSession) {
    return this.serialRepository.find(condition, limit, session);
  }
}
