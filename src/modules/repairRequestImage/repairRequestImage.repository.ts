import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateRepairRequestImageDto } from './dtos/create.dto';
import {
  RepairImageType,
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

  async findByRepairRequestIdGrouped(repairRequestId: string): Promise<{
    imageBefore: RepairRequestImage[];
    imageAfter: RepairRequestImage[];
  }> {
    const images = await this.model.find({ repairRequestId }).lean().exec();

    const imageBefore = images.filter(
      (img) => img.type === RepairImageType.BEFORE,
    );
    const imageAfter = images.filter(
      (img) => img.type === RepairImageType.AFTER,
    );

    return { imageBefore, imageAfter };
  }
}
