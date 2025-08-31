import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  InstalmentRequest,
  InstalmentRequestDocument,
} from './instalmentRequest.entity';

@Injectable()
export class InstalmentRequestRepository {
  constructor(
    @InjectModel(InstalmentRequest.name)
    private readonly model: Model<InstalmentRequestDocument>,
  ) {}

  async findByUserId(userId: string) {
    return this.model
      .find({ userId: userId })
      .populate('productId')
      .populate('variableId')
      .populate('assignedStaffId', 'fullName phone')
      .sort({ createdAt: -1 })
      .exec();
  }

  async create(data: any): Promise<InstalmentRequest> {
    return this.model.create(data);
  }

  async findAll(): Promise<InstalmentRequest[]> {
    return this.model.find().populate('userId assignedStaffId productId');
  }

  async findById(id: string): Promise<InstalmentRequest | null> {
    return this.model
      .findById(id)
      .populate('userId assignedStaffId productId variableId')
      .lean();
  }

  async updateStatus({
    id,
    status,
    resultImage,
    assignedStaffId,
  }: {
    id: string;
    status: string;
    resultImage?: string;
    assignedStaffId?: string;
  }): Promise<InstalmentRequest | null> {
    const updateData: any = { status };
    if (resultImage) {
      updateData.resultImage = resultImage;
    }
    if (assignedStaffId) {
      updateData.assignedStaffId = assignedStaffId;
    }
    return this.model.findByIdAndUpdate(id, updateData, { new: true });
  }

  async getRequestsByStaff(userId: string, role: string) {
    const query: any = {};
    if (role === 'ADMIN') {
    } else {
      query.$or = [{ assignedStaffId: userId }, { status: 'pending' }];
    }

    return this.model.find(query).sort({ updatedAt: -1 }).exec();
  }
}
