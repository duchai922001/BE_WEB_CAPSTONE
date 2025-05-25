import { InjectModel } from '@nestjs/mongoose';
import { Attribute, AttributeDocument } from './attribute.entity';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateAttributeDto } from './dtos/create.dto';

@Injectable()
export class AttributeRepository {
  constructor(
    @InjectModel(Attribute.name)
    private readonly attributeModel: Model<AttributeDocument>,
  ) {}

  create(data: CreateAttributeDto): Promise<Attribute> {
    return this.attributeModel.create(data);
  }

  findAll() {
    return this.attributeModel.find().populate('variableId');
  }

  findById(id: string) {
    return this.attributeModel.findById(id).populate('variableId');
  }
}
