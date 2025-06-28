import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateRepairRequestImageDto } from './dtos/create.dto';
import {
  RepairRequestImage,
  RepairRequestImageDocument,
} from './repairRequestImage.entity';

@Injectable()
export class RepairRequestImageRepository {
  constructor(
    @InjectModel(RepairRequestImage.name)
    private readonly model: Model<RepairRequestImageDocument>,
  ) {}

  create(data: CreateRepairRequestImageDto): Promise<RepairRequestImage> {
    return this.model.create(data);
  }

  findById(id: string) {
    return this.model.findById(id).populate('repairRequestId');
  }
}
