import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RepairInvoiceItemRepository } from './repair-invoice-item.repository';
import { UpdateRepairInvoiceItemDto } from './dtos/update-repair-invoice-item.dto';
import { CreateRepairInvoiceItemDto } from './dtos/create-repair-invoice-item.dto';
import { RepairServiceService } from '../repairService/repairService.service';
import { RepairRequestRepository } from '../repairRequest/repairRequest.repository';

@Injectable()
export class RepairInvoiceItemService {
  constructor(
    private readonly repo: RepairInvoiceItemRepository,
    private readonly repaireServiceSer: RepairServiceService,
    private readonly repairRequestRepo: RepairRequestRepository,
  ) {}

  async create(dto: CreateRepairInvoiceItemDto) {
    let totalPrice = 0;
    let laborCost = 0;

    if (dto.typeRepair === 'WARRANTY') {
      // Bảo hành: tất cả chi phí = 0
      laborCost = 0;
      totalPrice = 0;
      await this.repairRequestRepo.incrementCountWarranty(dto.repairRequestId);
    } else {
      // Normal: tính như hiện tại
      laborCost = dto.laborCost;
      totalPrice = laborCost;

      if (dto.repairServiceId) {
        const service = await this.repaireServiceSer.findById(
          dto.repairServiceId,
        );
        if (!service) {
          throw new BadRequestException('Thiết bị không tồn tại');
        }
        totalPrice += service.sellPrice;
      }
    }

    return this.repo.create({
      ...dto,
      laborCost,
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
