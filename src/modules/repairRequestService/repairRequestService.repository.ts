import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RepairRequestService,
  RepairRequestServiceDocument,
} from './repairRequestServicve.entity';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { builderQuery } from 'src/common/helpers/query-builder.helper';

@Injectable()
export class RepairRequestServiceReprository {
  constructor(
    @InjectModel(RepairRequestService.name)
    private readonly repairRequestServiceModel: Model<RepairRequestServiceDocument>,
  ) {}

  async create(data: any): Promise<RepairRequestServiceDocument> {
    const newRepairRequestService = new this.repairRequestServiceModel(data);
    return newRepairRequestService.save();
  }

  async findAll(query: BaseQueryDto): Promise<RepairRequestServiceDocument[]> {
    const { filter, pagination, sort } = builderQuery(query);
    const queryBuilder = this.repairRequestServiceModel
      .find(filter)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort(sort as any);
    return queryBuilder.exec();
  }
}
