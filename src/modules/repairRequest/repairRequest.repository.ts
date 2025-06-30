import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { RepairRequest, RepairRequestDocument } from './repairRequest.entity';
import { builderQuery } from 'src/common/helpers/query-builder.helper';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
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

  findAll() {
    return this.repairRequestModel
      .find()
      .populate(['userId', 'assignedStaffId', 'technicianId']);
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
}
