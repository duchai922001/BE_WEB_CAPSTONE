import { Injectable, NotFoundException } from '@nestjs/common';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { RepairRequestRepository } from './repairRequest.repository';
import {
  CreateRepairRequestDto,
  RepairRequestServices,
} from './dtos/customer-create-repair-request.dto';
import { RepairRequestServiceReprository } from '../repairRequestService/repairRequestService.repository';

@Injectable()
export class RepairRequestService {
  constructor(
    private readonly repairRequestRepo: RepairRequestRepository,
    private readonly repairRequestSeviceRepo: RepairRequestServiceReprository,
  ) {}

  async create(data: CreateRepairRequestDto) {
    const { repairRequestServices, ...payloadOther } = data;

    const MAX_RETRIES = 5;
    let retry = 0;
    let repairRequestCode: string;
    let repairRequest: any;

    while (retry < MAX_RETRIES) {
      repairRequestCode = `${Date.now()}${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`;

      try {
        repairRequest = await this.repairRequestRepo.create({
          ...payloadOther,
          repairRequestCode,
        });
        break;
      } catch (error) {
        if (error.code === 11000 && error.keyPattern?.repairRequestCode) {
          retry++;
          continue;
        }
        throw error;
      }
    }

    if (!repairRequest) {
      throw new Error(
        'Could not create unique repairRequestCode after retries',
      );
    }

    if (repairRequestServices?.length) {
      await Promise.all(
        repairRequestServices.map((item: RepairRequestServices) =>
          this.repairRequestSeviceRepo.create({
            repairRequestId: repairRequest._id,
            repairServiceId: item.repairServiceId,
            note: item.note,
          }),
        ),
      );
    }
    return repairRequest;
  }

  async findById(id: string) {
    const result = await this.repairRequestRepo.findById(id);
    if (!result) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return result;
  }

  findAll() {
    return this.repairRequestRepo.findAll();
  }

  async updateStatus(id: string, status: string) {
    const result = await this.repairRequestRepo.updateStatus(id, status);
    if (!result) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return result;
  }

  async delete(id: string) {
    const result = await this.repairRequestRepo.delete(id);
    if (!result) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return result;
  }
}
