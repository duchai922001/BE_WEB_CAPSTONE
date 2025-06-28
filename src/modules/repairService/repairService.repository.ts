import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RepairService, RepairServiceDocument } from './repairService.entity';
import { CreateRepairServiceDto } from './dtos/create.dto';
import { UpdateRepairServiceDto } from './dtos/update.dto';

@Injectable()
export class RepairServiceRepository {
  constructor(
    @InjectModel(RepairService.name)
    private readonly model: Model<RepairServiceDocument>,
  ) {}

  create(data: CreateRepairServiceDto): Promise<RepairService> {
    return this.model.create(data);
  }

  findById(id: string) {
    return this.model.findById(id).populate('createBy');
  }

  async findAll(): Promise<RepairService[]> {
    return this.model.find({ status: true }).sort({ createdAt: -1 }).exec();
  }

  async update(
    id: string,
    data: UpdateRepairServiceDto,
  ): Promise<RepairService> {
    const updated = await this.model.findByIdAndUpdate(id, data, { new: true });
    if (!updated) {
      throw new NotFoundException(`RepairService with ID ${id} not found`);
    }
    return updated;
  }

  async softDelete(id: string): Promise<RepairService> {
    const deleted = await this.model.findByIdAndUpdate(
      id,
      { status: false },
      { new: true },
    );
    if (!deleted) {
      throw new NotFoundException(`RepairService with ID ${id} not found`);
    }
    return deleted;
  }
}
