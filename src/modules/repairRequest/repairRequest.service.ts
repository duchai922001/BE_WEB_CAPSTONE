import { Injectable, NotFoundException } from '@nestjs/common';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { RepairRequestRepository } from './repairRequest.repository';
import {
  CreateRepairRequestDto,
  RepairRequestServices,
} from './dtos/customer-create-repair-request.dto';
import { RepairRequestServiceReprository } from '../repairRequestService/repairRequestService.repository';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { RepairRequestImageService } from '../repairRequestImage/repairRequestImage.service';
import { RepairImageType } from '../repairRequestImage/repairRequestImage.entity';

@Injectable()
export class RepairRequestService {
  constructor(
    private readonly repairRequestRepo: RepairRequestRepository,
    private readonly repairRequestSeviceRepo: RepairRequestServiceReprository,
    private readonly repairRequestImageService: RepairRequestImageService,
  ) {}

  async create(userId: string, data: CreateRepairRequestDto) {
    const { repairRequestServices, imageDeviceBefore, ...payloadOther } = data;

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
          userId: userId,
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

    if (imageDeviceBefore?.length) {
      await Promise.all(
        imageDeviceBefore.map((url: string) =>
          this.repairRequestImageService.create({
            repairRequestId: repairRequest._id.toString(),
            url,
            note: '',
            type: RepairImageType.BEFORE,
          }),
        ),
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

  async getByUserId(userId: string) {
    const repairRequests = await this.repairRequestRepo.getByUserId(userId);
    return repairRequests;
  }

  async findById(id: string) {
    const result = await this.repairRequestRepo.findById(id);
    if (!result) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);

    const images =
      await this.repairRequestImageService.findByRepairRequestIdGrouped(id);

    return {
      ...(result.toObject?.() ?? result),
      imageBefore: images.imageBefore,
      imageAfter: images.imageAfter,
    };
  }

  findAll(query: BaseQueryDto) {
    return this.repairRequestRepo.findAll(query);
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

  async assignStaffAndTechnician(
    id: string,
    assignedStaffId?: string,
    technicianId?: string,
  ) {
    return this.repairRequestRepo.assignStaffAndTechnician(
      id,
      assignedStaffId,
      technicianId,
    );
  }
}
