import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInstalmentRequestDto } from './dtos/create.dto';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { InstalmentRequestRepository } from './instalmentRequest.repository';

@Injectable()
export class InstalmentRequestService {
  constructor(private readonly repo: InstalmentRequestRepository) {}

  create(userId: string, dto: CreateInstalmentRequestDto) {
    return this.repo.create({
      ...dto,
      userId,
    });
  }

  findAll() {
    return this.repo.findAll();
  }

  async findById(id: string) {
    const request = await this.repo.findById(id);
    if (!request) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return request;
  }

  async updateStatus(id: string, status: boolean) {
    const updated = await this.repo.updateStatus(id, status);
    if (!updated) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return updated;
  }
}
