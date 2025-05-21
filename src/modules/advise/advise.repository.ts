import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Advise } from './advise.entity';
import { Model } from 'mongoose';

@Injectable()
export class AdviseRepository {
  constructor(
    @InjectModel(Advise.name) private readonly adviseModel: Model<Advise>,
  ) {}

  async create(dto: any): Promise<Advise> {
    const newCustomer = new this.adviseModel(dto);
    return newCustomer.save();
  }
}
