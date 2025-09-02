import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Variable, VariableDocument } from './variable.entity';
import { Model, Types } from 'mongoose';
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
    return this.variableModel
      .find({ productId })
      .populate('productId')
      .populate('attributes')
      .lean()
      .exec();
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

  async decreaseStock(variableId: string, quantity: number) {
    if (!Types.ObjectId.isValid(variableId)) {
      throw new BadRequestException('ID biến thể không hợp lệ');
    }

    if (quantity <= 0) {
      throw new BadRequestException('Số lượng phải lớn hơn 0');
    }

    // Tìm biến thể
    const variable = await this.variableModel.findById(variableId);
    if (!variable) {
      throw new NotFoundException('Không tìm thấy biến thể');
    }

    if (variable.stock < quantity) {
      throw new BadRequestException('Tồn kho biến thể không đủ');
    }

    variable.stock -= quantity;
    await variable.save();

    return {
      message: 'Cập nhật tồn kho biến thể thành công',
      variable,
    };
  }

  async increaseStock(variableId: string, quantity: number) {
    if (!Types.ObjectId.isValid(variableId)) {
      throw new BadRequestException('ID biến thể không hợp lệ');
    }

    if (quantity <= 0) {
      throw new BadRequestException('Số lượng phải lớn hơn 0');
    }

    // Tìm biến thể
    const variable = await this.variableModel.findById(variableId);
    if (!variable) {
      throw new NotFoundException('Không tìm thấy biến thể');
    }

    variable.stock += quantity;
    await variable.save();

    return {
      message: 'Tăng tồn kho biến thể thành công',
      variable,
    };
  }

  async findByIds(ids: string[]) {
    const objectIds = ids
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));

    if (!objectIds.length) {
      return [];
    }

    return this.variableModel.find({
      _id: { $in: objectIds },
    });
  }
}
