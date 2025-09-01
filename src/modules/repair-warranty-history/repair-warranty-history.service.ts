import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, Types, Connection } from 'mongoose';
import {
  RepairWarrantyHistory,
  RepairWarrantyHistoryDocument,
} from './repair-warranty-history.entity';
import {
  CreateRepairWarrantyHistoryDto,
  QueryRepairWarrantyHistoryDto,
  UpdatePhotosDto,
  UpdateRepairWarrantyHistoryDto,
  UpdateStatusDto,
} from './repair-warranty-history.dto';
import { RepairWarrantyHistoryStatus } from 'src/common/enums/repair-warranty-history';
import {
  RepairRequest,
  RepairRequestDocument,
} from '../repairRequest/repairRequest.entity';

@Injectable()
export class RepairWarrantyHistoryService {
  constructor(
    @InjectModel(RepairWarrantyHistory.name)
    private readonly model: Model<RepairWarrantyHistoryDocument>,
    @InjectModel(RepairRequest.name)
    private readonly requestModel: Model<RepairRequestDocument>,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async create(staffId: string, dto: CreateRepairWarrantyHistoryDto) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const reqId = new Types.ObjectId(dto.repairRequestId);

      const updatedReq = await this.requestModel.findByIdAndUpdate(
        reqId,
        { $inc: { countWarranty: 1 } },
        { new: true, session, projection: { countWarranty: 1 } },
      );
      if (!updatedReq) {
        throw new Error('RepairRequest not found');
      }

      const nextCount = updatedReq.countWarranty ?? 1;

      const payload = {
        ...dto,
        repairRequestId: dto.repairRequestId,
        assignedStaffId: staffId,

        countWarranty: nextCount,
      };

      const [doc] = await this.model.create([payload], { session });

      await session.commitTransaction();
      return doc;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  async findById(id: string) {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException('Warranty history not found');
    return doc;
  }

  async findAll(query: QueryRepairWarrantyHistoryDto) {
    const { page = 1, limit = 20, repairRequestId, status, from, to } = query;
    const filter: FilterQuery<RepairWarrantyHistoryDocument> = {};

    if (repairRequestId)
      filter.repairRequestId = new Types.ObjectId(repairRequestId);
    if (status) filter.status = status;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const [items, total] = await Promise.all([
      this.model
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.model.countDocuments(filter),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findByRepairRequest(repairRequestId: string, page = 1, limit = 20) {
    return this.findAll({ repairRequestId, page, limit });
  }

  async update(id: string, dto: UpdateRepairWarrantyHistoryDto) {
    const updated = await this.model
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Warranty history not found');
    return updated;
  }

  async updateStatus(id: string, dto: UpdateStatusDto) {
    const updated = await this.model
      .findByIdAndUpdate(
        id,
        {
          $set: {
            status: dto.status,
            diagnosis: dto.diagnosis,
            reason: dto.reason,
          },
        },
        { new: true },
      )
      .exec();
    if (!updated) throw new NotFoundException('Warranty history not found');
    return updated;
  }

  async updatePhotos(id: string, dto: UpdatePhotosDto) {
    const inc: any = {};
    if (dto.photosBefore?.length)
      inc.photosBefore = { $each: dto.photosBefore };
    if (dto.photosAfter?.length) inc.photosAfter = { $each: dto.photosAfter };

    const update =
      dto.photosBefore || dto.photosAfter
        ? {
            ...(dto.photosBefore ? { photosBefore: dto.photosBefore } : {}),
            ...(dto.photosAfter ? { photosAfter: dto.photosAfter } : {}),
          }
        : {};

    const updated = await this.model
      .findByIdAndUpdate(id, { $set: update }, { new: true })
      .exec();

    if (!updated) throw new NotFoundException('Warranty history not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Warranty history not found');
    return { success: true };
  }

  async getSummaryByRepairRequestId(repairRequestId: string) {
    console.log({ repairRequestId });
    const pendingStatuses = new Set([
      RepairWarrantyHistoryStatus.RECEIVED,
      RepairWarrantyHistoryStatus.CHECKING,
      RepairWarrantyHistoryStatus.IN_PROGRESS,
      RepairWarrantyHistoryStatus.WAITING_PARTS,
    ]);

    const data = await this.model
      .find({ repairRequestId: repairRequestId })
      .populate('assignedStaffId')
      .populate('technicianId')
      .sort({ createdAt: 1, _id: 1 })
      .lean()
      .exec();

    const latest = await this.model
      .findOne({ repairRequestId: repairRequestId })
      .sort({ createdAt: -1, _id: -1 })
      .select({ status: 1 })
      .lean()
      .exec();

    const isPending = latest ? pendingStatuses.has(latest.status) : false;

    return { data, isPending };
  }
}
