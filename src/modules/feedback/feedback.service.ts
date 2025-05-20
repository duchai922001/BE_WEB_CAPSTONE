import { Injectable, NotFoundException } from '@nestjs/common';
import { FeedbackRepository } from './feedback.repository';
import { CreateFeedbackDto } from './dtos/create.feedback';
import { UpdateFeedbackDto } from './dtos/update.feedback';

@Injectable()
export class FeedbackService {
  constructor(private readonly feedbackRepo: FeedbackRepository) {}

  async create(dto: CreateFeedbackDto) {
    return this.feedbackRepo.create(dto);
  }

  async findAll() {
    return this.feedbackRepo.findAll();
  }

  async findById(id: string) {
    const feedback = await this.feedbackRepo.findById(id);
    if (!feedback) throw new NotFoundException('Feedback not found');
    return feedback;
  }

  async update(id: string, dto: UpdateFeedbackDto) {
    const updated = await this.feedbackRepo.update(id, dto);
    if (!updated) throw new NotFoundException('Feedback not found');
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.feedbackRepo.delete(id);
    if (!deleted) throw new NotFoundException('Feedback not found');
    return deleted;
  }
}
