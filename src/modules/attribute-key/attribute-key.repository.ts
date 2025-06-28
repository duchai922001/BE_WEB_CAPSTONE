import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AttributeKey, AttributeKeyDocument } from './attribute-key.entity';

@Injectable()
export class AttributeKeyRepository {
  constructor(
    @InjectModel(AttributeKey.name)
    private readonly model: Model<AttributeKeyDocument>,
  ) {}

  create(name: string) {
    return this.model.create({ name });
  }

  findAll() {
    return this.model.find().exec();
  }

  findById(id: string) {
    return this.model.findById(id).exec();
  }

  delete(id: string) {
    return this.model.findByIdAndDelete(id).exec();
  }
}
