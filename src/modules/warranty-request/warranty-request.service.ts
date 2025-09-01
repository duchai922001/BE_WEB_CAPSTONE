import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  WarrantyRequest,
  WarrantyRequestDocument,
} from './warranty-request.entity';
import {
  CreateWarrantyRequestDto,
  UpdateWarrantyRequestDto,
  UpdateWarrantyStatusDto,
} from './warranty-request.dto';
import { WarrantyRequestStatus } from 'src/common/enums/warranty-request';

@Injectable()
export class WarrantyRequestService {
  constructor(
    @InjectModel(WarrantyRequest.name)
    private warrantyRequestModel: Model<WarrantyRequestDocument>,
  ) {}

  async create(dto: CreateWarrantyRequestDto): Promise<WarrantyRequest> {
    const created = new this.warrantyRequestModel(dto);
    return created.save();
  }

  async findAll(): Promise<WarrantyRequest[]> {
    return this.warrantyRequestModel
      .find()
      .populate('orderItemId')
      .populate('createdBy')
      .populate('customerId')
      .exec();
  }

  async findOne(id: string): Promise<WarrantyRequest> {
    const request = await this.warrantyRequestModel
      .findById(id)
      .populate('orderItemId')
      .populate('createdBy')
      .populate('customerId')
      .exec();
    if (!request)
      throw new NotFoundException(`WarrantyRequest #${id} not found`);
    return request;
  }

  async update(
    id: string,
    dto: UpdateWarrantyRequestDto,
  ): Promise<WarrantyRequest> {
    const updated = await this.warrantyRequestModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated)
      throw new NotFoundException(`WarrantyRequest #${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.warrantyRequestModel
      .findByIdAndDelete(id)
      .exec();
    if (!deleted)
      throw new NotFoundException(`WarrantyRequest #${id} not found`);
  }

  async list({
    status,
    q,
    limit = 20,
    page = 1,
  }: {
    status?: string;
    q?: string;
    limit?: number;
    page?: number;
  }) {
    const filter: any = {};
    if (status) filter.status = status;
    if (q) {
      const rx = new RegExp(q, 'i');
      filter.$or = [
        { brandTicketNo: rx },
        { serviceCenterName: rx },
        { toBrandTrackingNo: rx },
        { fromBrandTrackingNo: rx },
      ];
    }

    const [items, total] = await Promise.all([
      this.warrantyRequestModel
        .find(filter)
        .populate('orderItemId')
        .populate('customerId', 'fullName phone email')
        .populate('createdBy', 'fullName')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.warrantyRequestModel.countDocuments(filter),
    ]);

    return { items, total, page, limit };
  }

  private assertTransition(
    from: WarrantyRequestStatus,
    to: WarrantyRequestStatus,
  ) {
    const allow: Record<WarrantyRequestStatus, WarrantyRequestStatus[]> = {
      [WarrantyRequestStatus.RECEIVE]: [WarrantyRequestStatus.SENT_TO_BRAND],
      [WarrantyRequestStatus.SENT_TO_BRAND]: [
        WarrantyRequestStatus.AT_BRAND_CHECKING,
        WarrantyRequestStatus.AT_BRAND_REPAIRING,
      ],
      [WarrantyRequestStatus.AT_BRAND_CHECKING]: [
        WarrantyRequestStatus.AT_BRAND_REPAIRING,
        WarrantyRequestStatus.WAITING_CUSTOMER_APPROVAL,
        WarrantyRequestStatus.BRAND_DONE,
        WarrantyRequestStatus.BRAND_REJECTED,
      ],
      [WarrantyRequestStatus.AT_BRAND_REPAIRING]: [
        WarrantyRequestStatus.WAITING_CUSTOMER_APPROVAL,
        WarrantyRequestStatus.BRAND_DONE,
        WarrantyRequestStatus.BRAND_REJECTED,
      ],
      [WarrantyRequestStatus.WAITING_CUSTOMER_APPROVAL]: [
        WarrantyRequestStatus.AT_BRAND_REPAIRING,
        WarrantyRequestStatus.BRAND_DONE,
        WarrantyRequestStatus.BRAND_REJECTED,
      ],
      [WarrantyRequestStatus.BRAND_DONE]: [
        WarrantyRequestStatus.RETURNED_TO_STORE,
      ],
      [WarrantyRequestStatus.BRAND_REJECTED]: [
        WarrantyRequestStatus.RETURNED_TO_STORE,
      ],
      [WarrantyRequestStatus.RETURNED_TO_STORE]: [
        WarrantyRequestStatus.READY_FOR_PICKUP,
        WarrantyRequestStatus.DELIVERED,
      ],
      [WarrantyRequestStatus.READY_FOR_PICKUP]: [
        WarrantyRequestStatus.DELIVERED,
      ],
      [WarrantyRequestStatus.DELIVERED]: [],
      [WarrantyRequestStatus.FAIL]: [],
    };
    const nexts = allow[from] ?? [];
    if (!nexts.includes(to)) {
      throw new BadRequestException(`Không hợp lệ: ${from} → ${to}`);
    }
  }

  async updateStatus(id: string, dto: UpdateWarrantyStatusDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('id không hợp lệ');
    }
    const wr = await this.warrantyRequestModel.findById(id);
    if (!wr) throw new NotFoundException('Không tìm thấy yêu cầu');

    const from = wr.status;
    const to = dto.status;

    const legacyMap: any = {
      PROGRESS: WarrantyRequestStatus.AT_BRAND_CHECKING,
      RETURN: WarrantyRequestStatus.RETURNED_TO_STORE,
      DONE: WarrantyRequestStatus.DELIVERED,
    };
    const next = (legacyMap[to as any] as WarrantyRequestStatus) || to;

    this.assertTransition(from, next);

    if (dto.expectedDate) wr.expectedDate = new Date(dto.expectedDate);

    switch (next) {
      case WarrantyRequestStatus.SENT_TO_BRAND:
        wr.serviceCenterName = dto.serviceCenterName ?? wr.serviceCenterName;
        wr.brandTicketNo = dto.brandTicketNo ?? wr.brandTicketNo;
        wr.toBrandCarrier = dto.toBrandCarrier ?? wr.toBrandCarrier;
        wr.toBrandTrackingNo = dto.toBrandTrackingNo ?? wr.toBrandTrackingNo;
        wr.toBrandShippedAt = new Date();
        break;

      case WarrantyRequestStatus.AT_BRAND_CHECKING:
        if (dto.toBrandReceivedAt) {
          wr.toBrandReceivedAt = new Date(dto.toBrandReceivedAt);
        } else if (!wr.toBrandReceivedAt) {
          wr.toBrandReceivedAt = new Date();
        }
        break;

      case WarrantyRequestStatus.WAITING_CUSTOMER_APPROVAL:
        wr.estimatedCost = dto.estimatedCost ?? wr.estimatedCost;
        wr.customerApproved = false;
        wr.approvalNote = dto.note ?? wr.approvalNote;
        break;

      case WarrantyRequestStatus.AT_BRAND_REPAIRING:
        break;

      case WarrantyRequestStatus.BRAND_DONE:
      case WarrantyRequestStatus.BRAND_REJECTED:
        wr.brandDiagnosis = dto.brandDiagnosis ?? wr.brandDiagnosis;
        wr.brandDecision = dto.brandDecision ?? wr.brandDecision;
        if (dto.actualCost != null) wr.actualCost = dto.actualCost;
        break;

      case WarrantyRequestStatus.RETURNED_TO_STORE:
        wr.fromBrandCarrier = dto.fromBrandCarrier ?? wr.fromBrandCarrier;
        wr.fromBrandTrackingNo =
          dto.fromBrandTrackingNo ?? wr.fromBrandTrackingNo;
        wr.fromBrandShippedAt = wr.fromBrandShippedAt ?? new Date();
        wr.fromBrandReceivedAt = new Date();
        wr.returnedDate = new Date();
        wr.expectedDate = wr.expectedDate ?? new Date();
        break;

      case WarrantyRequestStatus.READY_FOR_PICKUP:
        break;

      case WarrantyRequestStatus.DELIVERED:
        wr.deliveredAt = dto.deliveredAt
          ? new Date(dto.deliveredAt)
          : new Date();
        break;
    }

    wr.status = next;
    await wr.save();

    return this.warrantyRequestModel
      .findById(wr._id)
      .populate('orderItemId')
      .populate('customerId', 'fullName phone email')
      .populate('createdBy', 'fullName')
      .lean();
  }
}
