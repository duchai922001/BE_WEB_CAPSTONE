import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { RepairRequest, RepairRequestDocument } from './repairRequest.entity';
import { CreateRepairRequestDto } from './dtos/create.dto';

@Injectable()
export class RepairRequestRepository {
  constructor(
    @InjectModel(RepairRequest.name)
    private readonly model: Model<RepairRequestDocument>,
  ) {}

  create(data: CreateRepairRequestDto): Promise<RepairRequest> {
    return this.model.create(data);
  }

  findById(id: string) {
    return this.model
      .findById(id)
      .populate(['userId', 'assignedStaffId', 'technicianId']);
  }

  findAll() {
    return this.model
      .find()
      .populate(['userId', 'assignedStaffId', 'technicianId']);
  }

  updateStatus(id: string, status: string) {
    return this.model.findByIdAndUpdate(id, { status }, { new: true });
  }

  delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }
}
