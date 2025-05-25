import { InjectModel } from '@nestjs/mongoose';
import { Serial, SerialDocument } from './serial.entity';
import { Model } from 'mongoose';
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
}
