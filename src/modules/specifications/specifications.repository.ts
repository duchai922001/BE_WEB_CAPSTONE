import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Specifications,
  SpecificationsDocument,
} from './specifications.entity';
import {
  CreateSpecificationDto,
  UpdateSpecificationDto,
} from './dto/specifications.dto';
import {
  SpecificationsKey,
  SpecificationsKeyDocument,
} from '../specifications-key/specifications-key.entity';

@Injectable()
export class SpecificationsRepository {
  constructor(
    @InjectModel(SpecificationsKey.name)
    private specKeyModel: Model<SpecificationsKeyDocument>,
    @InjectModel(Specifications.name)
    private model: Model<SpecificationsDocument>,
  ) {}

  async createBulk(data: CreateSpecificationDto[]) {
    return this.model.insertMany(data);
  }

  async findByProductId(productId: string) {
    return this.model.find({ productId }).exec();
  }

  async getAll(): Promise<Specifications[]> {
    return this.model.find().populate('productId').exec();
  }

  async getById(id: string): Promise<Specifications | null> {
    return this.model.findById(id).exec();
  }

  async update(id: string, data: UpdateSpecificationDto) {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async getFilterableSpecifications() {
    const keys = await this.specKeyModel.find({ isFilter: true }).lean();
    console.log({ keys });
    const results = await Promise.all(
      keys.map(async (keyDoc) => {
        const values = await this.model
          .find({ key: keyDoc.key })
          .distinct('value');
        return {
          key: keyDoc.key,
          values,
        };
      }),
    );

    return results;
  }
}
