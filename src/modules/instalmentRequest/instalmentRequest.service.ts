import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInstalmentRequestDto } from './dtos/create.dto';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { InstalmentRequestRepository } from './instalmentRequest.repository';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';

@Injectable()
export class InstalmentRequestService {
  constructor(private readonly repo: InstalmentRequestRepository) {}

  create(userId: string, dto: CreateInstalmentRequestDto) {
    return this.repo.create({
      ...dto,
      userId,
    });
  }

  findAll() {
    return this.repo.findAll();
  }

  async findById(id: string) {
    const request = await this.repo.findById(id);
    if (!request) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return request;
  }

  async updateStatus(id: string, status: string) {
    const updated = await this.repo.updateStatus(id, status);
    if (!updated) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return updated;
  }

  async getRequestsByUser(userId: string, query: BaseQueryDto) {
    const { items, total } =
      await this.repo.findByUserIdWithPagination(userId, query);

    return {
      data: items.map((item: any) => ({
        _id: item._id,
        documentNumber: item.documentNumber,
        productName: item.productId?.name,
        fullName: item.userId?.fullName,
        phone: item.userId?.phone,
        income: item.income,
        occupation: item.occupation,
        address: item.address,
        bankName: item.bankId,
        status: item.status,
        requestDate: item.createdAt,
      })),
      pagination: {
        total,
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10,
        totalPages: Math.ceil(total / (Number(query.limit) || 10)),
      },
    };
  }
  
}
