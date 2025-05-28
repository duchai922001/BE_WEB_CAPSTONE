import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  InstalmentRequest,
  InstalmentRequestDocument,
} from './instalmentRequest.entity';
import { CreateInstalmentRequestDto } from './dtos/create.dto';

@Injectable()
export class InstalmentRequestRepository {
  constructor(
    @InjectModel(InstalmentRequest.name)
    private readonly model: Model<InstalmentRequestDocument>,
  ) {}

  async create(data: CreateInstalmentRequestDto): Promise<InstalmentRequest> {
    return this.model.create(data);
  }

  async findAll(): Promise<InstalmentRequest[]> {
    return this.model
      .find()
      .populate('userId assignedStaffId instalmentItemId');
  }

  async findById(id: string): Promise<InstalmentRequest | null> {
    return this.model
      .findById(id)
      .populate('userId assignedStaffId instalmentItemId');
  }

  async updateStatus(
    id: string,
    status: boolean,
  ): Promise<InstalmentRequest | null> {
    return this.model.findByIdAndUpdate(id, { status }, { new: true });
  }
}
