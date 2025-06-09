import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductImageDto } from './dtos/create.dto';
import { ProductImageRepository } from './productImage.repository';
import { ResponseMessage } from 'src/common/enums/responseMessage';

@Injectable()
export class ProductImageService {
  constructor(
    private readonly productImageRepository: ProductImageRepository,
  ) {}

  async create(dto: CreateProductImageDto) {
    return this.productImageRepository.create(dto);
  }

  async findById(id: string) {
    const image = await this.productImageRepository.findById(id);
    if (!image) throw new NotFoundException(ResponseMessage.FILE_NOT_FOUND);
    return image;
  }

  async findDefaultByProductIds(productIds: string[]) {
    return this.productImageRepository.findDefaultByProductIds(productIds);
  }
}
