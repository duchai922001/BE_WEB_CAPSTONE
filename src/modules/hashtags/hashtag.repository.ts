import { InjectModel } from '@nestjs/mongoose';
import { HashTag, HashTagDocument } from './hashtag.entity';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateHashTagDto } from './dtos/create.dto';

@Injectable()
export class HashTagRepository {
  constructor(
    @InjectModel(HashTag.name)
    private readonly hashTagModel: Model<HashTagDocument>,
  ) {}

  create(data: CreateHashTagDto): Promise<HashTag> {
    return this.hashTagModel.create(data);
  }

  findAll() {
    return this.hashTagModel.find();
  }

  findById(id: string) {
    return this.hashTagModel.findById(id);
  }
}
