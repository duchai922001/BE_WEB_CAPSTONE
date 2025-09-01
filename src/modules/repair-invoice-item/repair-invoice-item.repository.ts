import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RepairInvoiceItem,
  RepairInvoiceItemDocument,
} from './repair-invoice-item.entity';

@Injectable()
export class RepairInvoiceItemRepository {
  constructor(
    @InjectModel(RepairInvoiceItem.name)
    private readonly model: Model<RepairInvoiceItemDocument>,
  ) {}

  async create(data: any): Promise<RepairInvoiceItem> {
    return this.model.create(data);
  }

  async findAll(): Promise<RepairInvoiceItem[]> {
    return this.model.find().populate('repairRequestId repairServiceId');
  }

  async findById(id: string): Promise<RepairInvoiceItem | null> {
    return this.model.findById(id).populate('repairRequestId repairServiceId');
  }

  async update(id: string, data: any): Promise<RepairInvoiceItem | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<RepairInvoiceItem | null> {
    return this.model.findByIdAndDelete(id);
  }

  async findByRepairRequestId(
    repairRequestId: string,
  ): Promise<RepairInvoiceItem[]> {
    return this.model
      .find({ repairRequestId })
      .populate('repairRequestId repairServiceId');
  }

  async findByRepairRequestIdWithPolicy(repairRequestId: string) {
    return this.model
      .find({ repairRequestId, totalPrice: { $gt: 0 } })
      .populate({
        path: 'repairServiceId',
        populate: {
          path: 'repairWarrantyPolicyId',
          model: 'RepairWarrantyPolicy',
        },
      })
      .populate({
        path: 'repairRequestId',
      })
      .exec();
  }

  async findFreeServicesByRequestId(
    repairRequestId: string,
  ): Promise<RepairInvoiceItem[]> {
    return this.model
      .find({
        repairRequestId: repairRequestId,
        totalPrice: 0,
      })
      .populate('repairServiceId')
      .exec();
  }
}
