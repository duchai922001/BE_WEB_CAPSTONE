import { Injectable, NotFoundException } from '@nestjs/common';
import { RepairInvoiceItemRepository } from './repair-invoice-item.repository';
import { UpdateRepairInvoiceItemDto } from './dtos/update-repair-invoice-item.dto';
import { CreateRepairInvoiceItemDto } from './dtos/create-repair-invoice-item.dto';

@Injectable()
export class RepairInvoiceItemService {
  constructor(private readonly repo: RepairInvoiceItemRepository) {}

  async create(dto: CreateRepairInvoiceItemDto) {
    return this.repo.create(dto);
  }

  async findAll() {
    return this.repo.findAll();
  }

  async findOne(id: string) {
    const item = await this.repo.findById(id);
    if (!item) throw new NotFoundException('RepairInvoiceItem not found');
    return item;
  }

  async update(id: string, dto: UpdateRepairInvoiceItemDto) {
    const updated = await this.repo.update(id, dto);
    if (!updated) throw new NotFoundException('RepairInvoiceItem not found');
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.repo.delete(id);
    if (!deleted) throw new NotFoundException('RepairInvoiceItem not found');
    return deleted;
  }

  async findByRepairRequestId(repairRequestId: string) {
    return this.repo.findByRepairRequestId(repairRequestId);
  }
}
