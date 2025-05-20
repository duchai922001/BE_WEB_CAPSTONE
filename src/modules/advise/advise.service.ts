import { Injectable } from '@nestjs/common';
import { AdviseRepository } from './advise.repository';

@Injectable()
export class AdviseService {
  constructor(private readonly adviseRepository: AdviseRepository) {}
  async saveAdvise(data: {
    name: string;
    phone: string;
    initialMessage: string;
    assignedStaffName: string;
  }) {
    return this.adviseRepository.create(data);
  }
}
