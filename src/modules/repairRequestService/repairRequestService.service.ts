import { Injectable, Query } from '@nestjs/common';
import { RepairRequestServiceReprository } from './repairRequestService.repository';
import { CreateRepairRequestServiceDto } from './dtos/create.dto';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';

@Injectable()
export class RepairRequestServiceService {
  constructor(
    private readonly repairRequestServieRepository: RepairRequestServiceReprository,
  ) {}

  async create(dto: CreateRepairRequestServiceDto) {
    return await this.repairRequestServieRepository.create(dto);
  }

  async getAll(query: BaseQueryDto) {
    return await this.repairRequestServieRepository.findAll(query);
  }
}
