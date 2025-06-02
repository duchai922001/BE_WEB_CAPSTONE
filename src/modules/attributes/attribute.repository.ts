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

  async findByVariableId(variableId: string): Promise<AttributeDocument[]> {
    return this.attributeModel.find({ variableId }).exec();
  }

  async deleteById(id: string): Promise<void> {
    await this.attributeModel.findByIdAndDelete(id).exec();
  }

  async deleteByVariableId(variableId: string): Promise<void> {
    await this.attributeModel.deleteMany({ variableId }).exec();
  }

  async deleteManyByVariableIds(variableIds: string[]): Promise<void> {
    await this.attributeModel
      .deleteMany({ variableId: { $in: variableIds } })
      .exec();
  }
}
