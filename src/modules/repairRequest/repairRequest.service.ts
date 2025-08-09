import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { UpdateRepairRequestTimestampDto } from './dtos/update-repair-request-timestamp.dto';
import { UpdateRepairRequestInfoDto } from './dtos/update.dto';
import { RepairRequestStatus } from 'src/common/enums/repairRequestStatus';
import { RepairRequest, RepairRequestDocument } from './repairRequest.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RepairInvoiceItemRepository } from '../repair-invoice-item/repair-invoice-item.repository';
import { RepairWarrantyPolicyRepository } from '../repair-warranty-policy/repair-warranty-policy.repository';
import { RepairServiceRepository } from '../repairService/repairService.repository';
import { RepairInvoiceItem } from '../repair-invoice-item/repair-invoice-item.entity';
import { RepairWarrantyPolicy } from '../repair-warranty-policy/repair-warranty-policy.entity';
import { formatTimeLeft, parseDuration } from 'src/common/utils/parseDuration';

@Injectable()
export class RepairRequestService {
  constructor(
    @InjectModel(RepairRequest.name)
    private readonly model: Model<RepairRequestDocument>,
    private readonly repairRequestRepo: RepairRequestRepository,
    private readonly repairRequestSeviceRepo: RepairRequestServiceReprository,
    private readonly repairRequestImageService: RepairRequestImageService,
    private readonly repairWarrantyPolicyRepo: RepairWarrantyPolicyRepository,
    private readonly repairInvoiceItemRepo: RepairInvoiceItemRepository,
    private readonly repairServiceRepo: RepairServiceRepository,
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

  async updateTimestamp(dto: UpdateRepairRequestTimestampDto) {
    const allowedFields = [
      'dropoffActualDate',
      'processingDate',
      'pickupAppointmentDate',
      'completionDate',
      'cancelledDate',
    ];

    if (!allowedFields.includes(dto.field)) {
      throw new BadRequestException('Field không hợp lệ');
    }

    const updated = await this.repairRequestRepo.updateTimestampByField(
      dto.repairRequestId,
      dto.field,
    );

    if (dto.field === 'processingDate') {
      await this.updateStatus(
        dto.repairRequestId,
        RepairRequestStatus.WAIT_CUSTOMER_RECEIVE,
      );
    }

    if (dto.field === 'completionDate') {
      await this.updateStatus(
        dto.repairRequestId,
        RepairRequestStatus.COMPLETED,
      );
    }

    return updated;
  }

  async updateRepairInfo(id: string, dto: UpdateRepairRequestInfoDto) {
    await this.repairRequestRepo.updateInfo(id, {
      deviceSerial: dto.deviceSerial,
      issueDescription: dto.issueDescription,
    });

    if (dto.imageAfter?.length) {
      await Promise.all(
        dto.imageAfter.map((url) =>
          this.repairRequestImageService.create({
            repairRequestId: id,
            url,
            note: '',
            type: RepairImageType.AFTER,
          }),
        ),
      );
    }

    return { success: true };
  }
  async searchWithWarranty(keyword: string) {
    const repairRequests =
      await this.repairRequestRepo.searchRepairRequest(keyword);

    if (!repairRequests || repairRequests.length === 0) {
      throw new NotFoundException('Không tìm thấy đơn sửa chữa');
    }

    const results = await Promise.all(
      repairRequests.map(async (req) => {
        const invoiceItems =
          await this.repairInvoiceItemRepo.findByRepairRequestIdWithPolicy(
            String(req._id),
          );
        const itemsWithWarranty = invoiceItems.map((item) => {
          const plainItem = item.toObject();

          const completionDateRaw = (plainItem.repairRequestId as any)
            ?.completionDate;
          const completionDate = completionDateRaw
            ? new Date(completionDateRaw)
            : new Date();

          const durationStr =
            (plainItem.repairServiceId as any)?.repairWarrantyPolicyId
              ?.duration || '3m';

          const durationMs = parseDuration(durationStr);

          const expiryDate = new Date(completionDate.getTime() + durationMs);

          const now = new Date();
          const isExpired = now > expiryDate;

          const timeLeftMs = isExpired
            ? 0
            : expiryDate.getTime() - now.getTime();

          return {
            ...plainItem,
            warranty: {
              duration: durationStr,
              expiryDate,
              isExpired,
              timeLeft: formatTimeLeft(timeLeftMs),
            },
          };
        });

        return {
          ...req,
          invoiceItems: itemsWithWarranty,
        };
      }),
    );

    return results;
  }
}
