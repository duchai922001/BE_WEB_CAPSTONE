import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback } from './feedback.entity';
import { CreateFeedbackDto } from './dtos/create.feedback';
import { UpdateFeedbackDto } from './dtos/update.feedback';
import { Types } from 'mongoose';

@Injectable()
export class FeedbackRepository {
  constructor(
    @InjectModel(Feedback.name)
    private readonly feedbackModel: Model<Feedback>,
  ) {}

  create(dto: CreateFeedbackDto) {
    return this.feedbackModel.create(dto);
  }

  findAll() {
    return this.feedbackModel.find().populate('userId productId');
  }

  findById(id: string) {
    return this.feedbackModel.findById(id).populate('userId productId');
  }

  update(id: string, dto: UpdateFeedbackDto) {
    return this.feedbackModel.findByIdAndUpdate(id, dto, { new: true });
  }

  delete(id: string) {
    return this.feedbackModel.findByIdAndDelete(id);
  }

  async findByProductId(productId: string) {
    return this.feedbackModel
      .find({ productId: new Types.ObjectId(productId) })
      .populate('userId')
      .exec();
  }
}
