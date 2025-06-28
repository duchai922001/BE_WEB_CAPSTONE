import { Injectable, NotFoundException } from '@nestjs/common';
import { RepairServiceRepository } from './repairService.repository';
import { CreateRepairServiceDto } from './dtos/create.dto';
import { UpdateRepairServiceDto } from './dtos/update.dto';
import { ResponseMessage } from 'src/common/enums/responseMessage';

@Injectable()
export class RepairServiceService {
  constructor(
    private readonly repairServiceRepository: RepairServiceRepository,
  ) {}

  async create(dto: CreateRepairServiceDto) {
    return this.repairServiceRepository.create(dto);
  }

  async findById(id: string) {
    const service = await this.repairServiceRepository.findById(id);
    if (!service) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return service;
  }

  async findAll() {
    return this.repairServiceRepository.findAll();
  }

  async update(id: string, dto: UpdateRepairServiceDto) {
    const updated = await this.repairServiceRepository.update(id, dto);
    if (!updated) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return updated;
  }

  async updateStatus(id: string, status: boolean) {
    const updated = await this.repairServiceRepository.update(id, { status });
    if (!updated) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.repairServiceRepository.softDelete(id);
    if (!deleted) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return deleted;
  }
}
