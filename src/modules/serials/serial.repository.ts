import { InjectModel } from '@nestjs/mongoose';
import { Serial, SerialDocument } from './serial.entity';
import { ClientSession, Model, Types } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
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

  async updateBySerialCode(
    serialCode: string,
    data: Partial<CreateSerialDto>,
  ): Promise<SerialDocument | null> {
    return this.serialModel
      .findOneAndUpdate({ serialCode }, data, { new: true })
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
  async markAsSold(productId: string, serialCodes: string[]) {
    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('productId không hợp lệ');
    }
    if (!serialCodes || !serialCodes.length) {
      throw new BadRequestException('Danh sách serialCodes là bắt buộc');
    }

    const result = await this.serialModel.updateMany(
      {
        productId: productId,
        serialCode: { $in: serialCodes },
        isSold: false,
      },
      { $set: { isSold: true } },
    );

    return {
      message: `Cập nhật thành công ${result.modifiedCount} serial`,
      modifiedCount: result.modifiedCount,
    };
  }

  async markVariableAsSold(
    productId: string,
    serialCodes: string[],
    variableId?: string,
  ) {
    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('productId không hợp lệ');
    }
    if (variableId && !Types.ObjectId.isValid(variableId)) {
      throw new BadRequestException('variableId không hợp lệ');
    }
    if (!serialCodes || !serialCodes.length) {
      throw new BadRequestException('serialCodes là bắt buộc');
    }

    const filter: any = {
      productId: productId,
      serialCode: { $in: serialCodes },
      isSold: false,
    };
    if (variableId) {
      filter.variableId = variableId;
    }

    const result = await this.serialModel.updateMany(filter, {
      $set: { isSold: true },
    });

    return {
      message: `Đã cập nhật ${result.modifiedCount} serial thành sold`,
      modifiedCount: result.modifiedCount,
    };
  }

  async markAsUnsold(productId: string, serialCodes: string[]) {
    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('productId không hợp lệ');
    }
    if (!serialCodes || !serialCodes.length) {
      throw new BadRequestException('Danh sách serialCodes là bắt buộc');
    }

    const result = await this.serialModel.updateMany(
      {
        productId: productId,
        serialCode: { $in: serialCodes },
        isSold: true,
      },
      { $set: { isSold: false } },
    );

    return {
      message: `Cập nhật thành công ${result.modifiedCount} serial`,
      modifiedCount: result.modifiedCount,
    };
  }

  async markVariableAsUnsold(
    productId: string,
    serialCodes: string[],
    variableId?: string,
  ) {
    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('productId không hợp lệ');
    }
    if (variableId && !Types.ObjectId.isValid(variableId)) {
      throw new BadRequestException('variableId không hợp lệ');
    }
    if (!serialCodes || !serialCodes.length) {
      throw new BadRequestException('serialCodes là bắt buộc');
    }

    const filter: any = {
      productId: productId,
      serialCode: { $in: serialCodes },
      isSold: true,
    };
    if (variableId) {
      filter.variableId = variableId;
    }

    const result = await this.serialModel.updateMany(filter, {
      $set: { isSold: false },
    });

    return {
      message: `Đã cập nhật ${result.modifiedCount} serial thành unsold`,
      modifiedCount: result.modifiedCount,
    };
  }
}
