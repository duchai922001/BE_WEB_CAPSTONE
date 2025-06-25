import { Injectable, NotFoundException } from '@nestjs/common';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { RepairRequestRepository } from './repairRequest.repository';
import { CreateRepairRequestDto } from './dtos/create.dto';

@Injectable()
export class RepairRequestService {
  constructor(private readonly repo: RepairRequestRepository) {}

  create(dto: CreateRepairRequestDto) {
    return this.repo.create(dto);
  }

  async findById(id: string) {
    const result = await this.repo.findById(id);
    if (!result) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return result;
  }

  findAll() {
    return this.repo.findAll();
  }

  async updateStatus(id: string, status: string) {
    const result = await this.repo.updateStatus(id, status);
    if (!result) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return result;
  }

  async delete(id: string) {
    const result = await this.repo.delete(id);
    if (!result) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return result;
  }
}
