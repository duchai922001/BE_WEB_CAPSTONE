import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Variable, VariableDocument } from './variable.entity';
import { Model } from 'mongoose';
import { IVariable } from './dtos/variable.interface';

@Injectable()
export class VariableRepository {
  constructor(
    @InjectModel(Variable.name)
    private readonly variableModel: Model<VariableDocument>,
  ) {}

  async create(data: IVariable): Promise<VariableDocument> {
    const newVariable = new this.variableModel(data);
    return newVariable.save();
  }

  async update(id: string, data: any): Promise<Variable | null> {
    return this.variableModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async findById(id: string): Promise<Variable | null> {
    return this.variableModel.findById(id).exec();
  }
  async findByProductId(productId: string): Promise<VariableDocument[]> {
    return this.variableModel.find({ productId }).exec();
  }

  async deleteById(id: string): Promise<void> {
    await this.variableModel.findByIdAndDelete(id).exec();
  }

  async deleteByProductId(productId: string): Promise<void> {
    await this.variableModel.deleteMany({ productId }).exec();
  }

  async deleteManyByIds(ids: string[]): Promise<void> {
    await this.variableModel.deleteMany({ _id: { $in: ids } }).exec();
  }

  async updateById(
    id: string,
    data: Partial<IVariable>,
  ): Promise<VariableDocument | null> {
    return this.variableModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }
}
