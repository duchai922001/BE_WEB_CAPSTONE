import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RepairRequest, RepairRequestDocument } from './repairRequest.entity';
import { builderQuery } from 'src/common/helpers/query-builder.helper';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { RepairRequestStatus } from 'src/common/enums/repairRequestStatus';
import { FilterRepairRequestDto } from './dtos/filter.dto';
@Injectable()
export class RepairRequestRepository {
  constructor(
    @InjectModel(RepairRequest.name)
    private readonly repairRequestModel: Model<RepairRequestDocument>,
  ) {}

  async create(data: any): Promise<RepairRequestDocument> {
    const newRepairRequest = new this.repairRequestModel(data);
    return newRepairRequest.save();
  }

  async getByUserId(userId: string): Promise<RepairRequestDocument[]> {
    const repairRequests = await this.repairRequestModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
    if (!repairRequests || repairRequests.length === 0) {
      throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    }
    return repairRequests;
  }

  async getAll(query: BaseQueryDto): Promise<RepairRequestDocument[]> {
    const { filter, pagination, sort } = builderQuery(query);
    const queryBuilder = this.repairRequestModel
      .find(filter)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort(sort as any);
    return queryBuilder.exec();
  }

  findById(id: string) {
    return this.repairRequestModel
      .findById(id)
      .populate(['userId', 'assignedStaffId', 'technicianId']);
  }

  async findAll(query: BaseQueryDto) {
    const { filter, pagination, sort, populate } = builderQuery(query);
    const pageNumber = parseInt(query.page ?? '1', 10);
    const limitNumber = parseInt(query.limit ?? '10', 10);

    let dbQuery = this.repairRequestModel
      .find(filter)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort(sort)
      .populate('userId');

    for (const field of populate) {
      dbQuery = dbQuery.populate(field);
    }

    const [data, total] = await Promise.all([
      dbQuery.exec(),
      this.repairRequestModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    };
  }

  updateStatus(id: string, status: string) {
    return this.repairRequestModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
  }

  delete(id: string) {
    return this.repairRequestModel.findByIdAndDelete(id);
  }

  async assignStaffAndTechnician(
    id: string,
    assignedStaffId?: string,
    technicianId?: string,
  ) {
    const updatePayload: any = {};
    if (assignedStaffId) updatePayload.assignedStaffId = assignedStaffId;
    if (technicianId) updatePayload.technicianId = technicianId;

    return this.repairRequestModel.findByIdAndUpdate(id, updatePayload, {
      new: true,
    });
  }

  async updateTimestampByField(repairRequestId: string, field: string) {
    return this.repairRequestModel.findByIdAndUpdate(
      repairRequestId,
      { [field]: new Date() },
      { new: true },
    );
  }

  async updateInfo(id: string, update: any) {
    return this.repairRequestModel.findByIdAndUpdate(id, update, { new: true });
  }

  async searchRepairRequest(keyword: string) {
    const filter = keyword
      ? {
          $or: [
            { customerName: { $regex: keyword, $options: 'i' } },
            { customerPhone: { $regex: keyword, $options: 'i' } },
            { repairRequestCode: { $regex: keyword, $options: 'i' } },
            { deviceSerial: { $regex: keyword, $options: 'i' } },
          ],
        }
      : {};

    const requests = await this.repairRequestModel.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'users',
          let: { techId: { $toObjectId: '$technicianId' } },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$techId'] } } },
            { $project: { fullName: 1, phone: 1, email: 1 } },
          ],
          as: 'technician',
        },
      },
      { $unwind: { path: '$technician', preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: 'users',
          let: { staffId: { $toObjectId: '$assignedStaffId' } },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$staffId'] } } },
            { $project: { fullName: 1, phone: 1, email: 1 } },
          ],
          as: 'assignedStaff',
        },
      },
      { $unwind: { path: '$assignedStaff', preserveNullAndEmptyArrays: true } },
    ]);

    return requests;
  }

  async incrementCountWarranty(repairRequestId: string) {
    return this.repairRequestModel.findByIdAndUpdate(
      repairRequestId,
      { $inc: { countWarranty: 1 } },
      { new: true },
    );
  }

  async updateCustomerPaid(id: string, amountToAdd: number) {
    const doc = await this.repairRequestModel.findById(id).exec();
    if (!doc) return null;

    const currentPaid = doc.customerPaid || 0;
    const currentDept = doc.customerDept || 0;

    const newPaid = currentPaid + amountToAdd;
    const newDept = Math.max(0, currentDept - amountToAdd);

    doc.customerPaid = newPaid;
    doc.customerDept = newDept;

    return doc.save();
  }

  async findActiveByTechnician(
    technicianId: string,
  ): Promise<RepairRequestDocument[]> {
    return this.repairRequestModel.find({
      technicianId: technicianId,
      status: {
        $in: [
          RepairRequestStatus.ASSIGNED_TECHNICAL,
          RepairRequestStatus.CUSTOMER_CONFIRMED,
        ],
      },
    });
  }

  async getTechnicianStats(technicianId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    const filter = {
      technicianId: technicianId,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    };

    const total = await this.repairRequestModel.countDocuments(filter);

    const waiting = await this.repairRequestModel.countDocuments({
      ...filter,
      status: RepairRequestStatus.ASSIGNED_TECHNICAL,
    });

    const processing = await this.repairRequestModel.countDocuments({
      ...filter,
      status: RepairRequestStatus.CUSTOMER_CONFIRMED,
    });

    const completed = await this.repairRequestModel.countDocuments({
      ...filter,
      status: RepairRequestStatus.WAIT_CUSTOMER_RECEIVE,
    });

    return {
      total,
      waiting,
      processing,
      completed,
    };
  }
  async getRequestsByUser(
    userId: string,
    role: string,
    filters: FilterRepairRequestDto,
  ) {
    const query: any = {};
    if (role === 'TECHNICIAN') {
      query.technicianId = userId;
    } else if (role === 'ADMIN') {
    } else {
      query.$or = [{ assignedStaffId: userId }, { status: 'PENDING' }];
    }

    if (filters?.statuses?.length) {
      query.status = { $in: filters.statuses };
    }

    if (filters?.fromDate || filters?.toDate) {
      query.createdAt = {};
      if (filters.fromDate) {
        query.createdAt.$gte = new Date(filters.fromDate);
      }
      if (filters.toDate) {
        query.createdAt.$lte = new Date(filters.toDate);
      }
    }

    return this.repairRequestModel.find(query).sort({ updatedAt: -1 }).exec();
  }

  async findByCode(code: string) {
    return this.repairRequestModel.findOne({ repairRequestCode: code }).exec();
  }
}
