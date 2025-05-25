import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.entity';
import { CreateCategoryDto } from './dtos/create.dto';
import { UpdateCategoryDto } from './dtos/update.dto';
import { builderQuery } from 'src/common/helpers/query-builder.helper';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async create(data: CreateCategoryDto): Promise<Category> {
    const newCategory = new this.categoryModel(data);
    return newCategory.save();
  }

  async findByName(name: string): Promise<Category | null> {
    return this.categoryModel.findOne({ name });
  }

  async findAll(query: BaseQueryDto): Promise<Category[]> {
    const { filter, pagination, sort } = builderQuery(query);
    const queryBuilder = this.categoryModel
      .find(filter)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort(sort as any);
    return queryBuilder.exec();
  }

  async findById(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!updatedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return updatedCategory;
  }

  async delete(id: string): Promise<Category> {
    const deletedCategory = await this.categoryModel
      .findByIdAndUpdate(id, { isDelete: true }, { new: true })
      .exec();
    if (!deletedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return deletedCategory;
  }
}
