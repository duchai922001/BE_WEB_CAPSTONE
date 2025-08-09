import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SpecificationsKey,
  SpecificationsKeyDocument,
} from './specifications-key.entity';

@Injectable()
export class SpecificationsKeyRepository {
  constructor(
    @InjectModel(SpecificationsKey.name)
    private model: Model<SpecificationsKeyDocument>,
  ) {}

  create(data: Partial<SpecificationsKey>) {
    return this.model.create(data);
  }

  findAll() {
    return this.model.find().exec();
  }

  findOne(id: string) {
    return this.model.findById(id).exec();
  }

  update(id: string, data: Partial<SpecificationsKey>) {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  delete(id: string) {
    return this.model.findByIdAndDelete(id).exec();
  }
}
