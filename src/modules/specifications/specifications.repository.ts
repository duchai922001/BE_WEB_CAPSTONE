import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Specifications,
  SpecificationsDocument,
} from './specifications.entity';
import {
  CreateSpecificationDto,
  UpdateSpecificationDto,
} from './dto/specifications.dto';

@Injectable()
export class SpecificationsRepository {
  constructor(
    @InjectModel(Specifications.name)
    private model: Model<SpecificationsDocument>,
  ) {}

  async createBulk(data: CreateSpecificationDto[]) {
    return this.model.insertMany(data);
  }

  async getAll(): Promise<Specifications[]> {
    return this.model.find().populate('productId').exec();
  }

  async getById(id: string) {
    return this.model.findById(id).exec();
  }

  async update(id: string, data: UpdateSpecificationDto) {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }
}
