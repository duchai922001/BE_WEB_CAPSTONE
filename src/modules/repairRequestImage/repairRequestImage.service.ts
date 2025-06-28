import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRepairRequestImageDto } from './dtos/create.dto';
import { RepairRequestImageRepository } from './repairRequestImage.repository';
import { ResponseMessage } from 'src/common/enums/responseMessage';

@Injectable()
export class RepairRequestImageService {
  constructor(
    private readonly repairRequestImageRepository: RepairRequestImageRepository,
  ) {}

  async create(dto: CreateRepairRequestImageDto) {
    return this.repairRequestImageRepository.create(dto);
  }

  async findById(id: string) {
    const image = await this.repairRequestImageRepository.findById(id);
    if (!image) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return image;
  }
}
