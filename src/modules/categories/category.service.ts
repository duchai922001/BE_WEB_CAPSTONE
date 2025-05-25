import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dtos/create.dto';
import { UpdateCategoryDto } from './dtos/update.dto';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(data: CreateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findByName(data.name);
    if (category) {
      throw new BadRequestException('Category đã tồn tại');
    }
    return await this.categoryRepository.create(data);
  }

  async getAll(query: BaseQueryDto): Promise<Category[]> {
    return await this.categoryRepository.findAll(query);
  }

  async getById(id: string): Promise<Category> {
    return await this.categoryRepository.findById(id);
  }

  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    return await this.categoryRepository.update(id, data);
  }

  async delete(id: string): Promise<Category> {
    return await this.categoryRepository.delete(id);
  }
}
