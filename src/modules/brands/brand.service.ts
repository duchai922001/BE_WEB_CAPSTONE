import { BadRequestException, Injectable } from '@nestjs/common';
import { BrandRepository } from './brand.repository';
import { Brand } from './brand.entity';
import { CreateBrandDto } from './dtos/create.dto';
import { UpdateBrandDto } from './dtos/update.dto';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { ProductRepository } from '../product/product.repository';

@Injectable()
export class BrandService {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly productRepository: ProductRepository,
  ) {}
  async create(data: CreateBrandDto): Promise<Brand> {
    const brand = await this.brandRepository.findByName(data.name);
    if (brand) {
      throw new BadRequestException('Brand đã tồn tại');
    }
    return await this.brandRepository.create(data);
  }
  async findById(id: string): Promise<Brand | null> {
    return this.brandRepository.findById(id);
  }
  async getAll(query: BaseQueryDto): Promise<Brand[]> {
    return await this.brandRepository.getAll(query);
  }

  async update(id: string, data: UpdateBrandDto): Promise<Brand> {
    return await this.brandRepository.update(id, data);
  }

  async delete(id: string): Promise<Brand> {
    return await this.brandRepository.delete(id);
  }

  async getBrandsByCategory(categoryId: string) {
    const brandIds =
      await this.productRepository.getBrandIdsByCategoryId(categoryId);
    return this.brandRepository.findByIds(brandIds);
  }
}
