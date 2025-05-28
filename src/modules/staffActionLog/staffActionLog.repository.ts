import { InjectModel } from '@nestjs/mongoose';
import {
  StaffActionLog,
  StaffActionLogDocument,
} from './staffActionLog.entity';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateActionLogDto } from './dtos/create.dto';

@Injectable()
export class StaffActionLogRepository {
  constructor(
    @InjectModel(StaffActionLog.name)
    private readonly staffActionModel: Model<StaffActionLogDocument>,
  ) {}

  create(data: CreateActionLogDto): Promise<StaffActionLog> {
    return this.staffActionModel.create(data);
  }
  //get all
  async findAll() {
    return this.staffActionModel
      .find()
      .sort({ createdAt: -1 })
      .populate('userId')
      .exec();
  }

  async findById(id: string) {
    const log = await this.staffActionModel
      .findById(id)
      .populate('userId')
      .lean();

    if (!log) return null;

    const refModel = log.refId;
    const populatedRef = await this.staffActionModel.populate(log, {
      path: 'refId',
      model: refModel,
    });
    return populatedRef;
  }
}
