import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RepairRequest, RepairRequestDocument } from './repairRequest.entity';
import { builderQuery } from 'src/common/helpers/query-builder.helper';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { ResponseMessage } from 'src/common/enums/responseMessage';
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
    console.log({ id, update });
    return this.repairRequestModel.findByIdAndUpdate(id, update, { new: true });
  }
}
