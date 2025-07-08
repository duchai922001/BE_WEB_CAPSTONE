import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RepairInvoiceItemRepository } from './repair-invoice-item.repository';
import { UpdateRepairInvoiceItemDto } from './dtos/update-repair-invoice-item.dto';
import { CreateRepairInvoiceItemDto } from './dtos/create-repair-invoice-item.dto';
import { RepairServiceService } from '../repairService/repairService.service';

@Injectable()
export class RepairInvoiceItemService {
  constructor(
    private readonly repo: RepairInvoiceItemRepository,
    private readonly repaireServiceSer: RepairServiceService,
  ) {}

  async create(dto: CreateRepairInvoiceItemDto) {
    let totalPrice = dto.laborCost;

    if (dto.repairServiceId) {
      const service = await this.repaireServiceSer.findById(
        dto.repairServiceId,
      );
      if (!service) {
        throw new BadRequestException('Thiết bị không tồn tại');
      }
      totalPrice += service.sellPrice;
    }

    return this.repo.create({
      ...dto,
      totalPrice,
    });
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
