import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  WarrantyRequest,
  WarrantyRequestDocument,
} from './warranty-request.entity';
import {
  CreateWarrantyRequestDto,
  UpdateWarrantyRequestDto,
} from './warranty-request.dto';

@Injectable()
export class WarrantyRequestService {
  constructor(
    @InjectModel(WarrantyRequest.name)
    private warrantyRequestModel: Model<WarrantyRequestDocument>,
  ) {}

  async create(dto: CreateWarrantyRequestDto): Promise<WarrantyRequest> {
    const created = new this.warrantyRequestModel(dto);
    return created.save();
  }

  async findAll(): Promise<WarrantyRequest[]> {
    return this.warrantyRequestModel
      .find()
      .populate('orderItemId')
      .populate('createdBy')
      .populate('customerId')
      .exec();
  }

  async findOne(id: string): Promise<WarrantyRequest> {
    const request = await this.warrantyRequestModel
      .findById(id)
      .populate('orderItemId')
      .populate('createdBy')
      .populate('customerId')
      .exec();
    if (!request)
      throw new NotFoundException(`WarrantyRequest #${id} not found`);
    return request;
  }

  async update(
    id: string,
    dto: UpdateWarrantyRequestDto,
  ): Promise<WarrantyRequest> {
    const updated = await this.warrantyRequestModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated)
      throw new NotFoundException(`WarrantyRequest #${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.warrantyRequestModel
      .findByIdAndDelete(id)
      .exec();
    if (!deleted)
      throw new NotFoundException(`WarrantyRequest #${id} not found`);
  }
}
