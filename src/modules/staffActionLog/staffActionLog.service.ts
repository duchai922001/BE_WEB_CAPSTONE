import { Injectable } from '@nestjs/common';
import { CreateActionLogDto } from './dtos/create.dto';
import { StaffActionLogRepository } from './staffActionLog.repository';

@Injectable()
export class StaffActionLogService {
  constructor(
    private readonly staffActionLogRepository: StaffActionLogRepository,
  ) {}

  async create(dto: CreateActionLogDto) {
    return this.staffActionLogRepository.create(dto);
  }

  async getAllLogs() {
    return this.staffActionLogRepository.findAll();
  }
}
