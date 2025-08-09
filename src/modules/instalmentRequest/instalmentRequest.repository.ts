import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  InstalmentRequest,
  InstalmentRequestDocument,
} from './instalmentRequest.entity';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { builderQuery } from 'src/common/helpers/query-builder.helper';

@Injectable()
export class InstalmentRequestRepository {
  constructor(
    @InjectModel(InstalmentRequest.name)
    private readonly model: Model<InstalmentRequestDocument>,
  ) {}

  // async findByUserId(userId: string) {
  //   return this.model
  //     .find({ userId: userId })
  //     .populate('instalmentItemId')
  //     .populate('assignedStaffId', 'fullName phone')
  //     .sort({ createdAt: -1 })
  //     .exec();
  // }
  async findByUserIdWithPagination(userId: string, query: BaseQueryDto) {
    const { filter, pagination, sort } = builderQuery(query);
    const finalFilter = { ...filter, userId };

    const [items, total] = await Promise.all([
      this.model
        .find(finalFilter)
        .populate('productId', 'name')
        // .populate('bankId', 'name')
        .populate('userId', 'fullName phone')
        .sort(sort as any)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .exec(),
      this.model.countDocuments(finalFilter),
    ]);

    return { items, total };
  }

  async create(data: any): Promise<InstalmentRequest> {
    return this.model.create(data);
  }

  async findAll(): Promise<InstalmentRequest[]> {
    return this.model
      .find()
      .populate('userId assignedStaffId instalmentItemId');
  }

  async findById(id: string): Promise<InstalmentRequest | null> {
    return this.model
      .findById(id)
      .populate('userId assignedStaffId');
  }

  async updateStatus(
    id: string,
    status: boolean,
  ): Promise<InstalmentRequest | null> {
    return this.model.findByIdAndUpdate(id, { status }, { new: true });
  }
}
