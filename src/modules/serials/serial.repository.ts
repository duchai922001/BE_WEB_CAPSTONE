import { InjectModel } from '@nestjs/mongoose';
import { Serial, SerialDocument } from './serial.entity';
import { ClientSession, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateSerialDto } from './dtos/create.dto';

@Injectable()
export class SerialRepository {
  constructor(
    @InjectModel(Serial.name)
    private readonly serialModel: Model<SerialDocument>,
  ) {}

  create(data: CreateSerialDto): Promise<Serial> {
    return this.serialModel.create(data);
  }

  findAll() {
    return this.serialModel.find().populate('productId variableId');
  }

  findById(id: string) {
    return this.serialModel.findById(id).populate('productId variableId');
  }
  async findByProductId(productId: string): Promise<SerialDocument[]> {
    return this.serialModel.find({ productId }).exec();
  }

  async deleteById(id: string): Promise<void> {
    await this.serialModel.findByIdAndDelete(id).exec();
  }

  async deleteByProductId(productId: string): Promise<void> {
    await this.serialModel.deleteMany({ productId }).exec();
  }

  async deleteManyByIds(ids: string[]): Promise<void> {
    await this.serialModel.deleteMany({ _id: { $in: ids } }).exec();
  }

  async updateById(
    id: string,
    data: Partial<CreateSerialDto>,
    session?: ClientSession,
  ): Promise<SerialDocument | null> {
    return this.serialModel
      .findByIdAndUpdate(id, data, { new: true, session })
      .exec();
  }

  async find(
    condition: any,
    limit?: number,
    session?: ClientSession,
  ): Promise<Serial[]> {
    const query = this.serialModel.find(condition);
    if (limit) {
      query.limit(limit);
    }
    if (session) {
      query.session(session);
    }
    return query.exec();
  }
}
