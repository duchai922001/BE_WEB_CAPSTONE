import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RepairServiceCategory,
  RepairServiceCategoryDocument,
} from './repairServiceCategory.entity';
import {
  CreateRepairServiceCategoryDto,
  UpdateRepairServiceCategoryDto,
} from './repairServiceCategory.dto';

@Injectable()
export class RepairServiceCategoryService {
  constructor(
    @InjectModel(RepairServiceCategory.name)
    private readonly categoryModel: Model<RepairServiceCategoryDocument>,
  ) {}

  async create(
    dto: CreateRepairServiceCategoryDto,
  ): Promise<RepairServiceCategory> {
    const created = new this.categoryModel(dto);
    return created.save();
  }

  async findAll(): Promise<RepairServiceCategory[]> {
    return this.categoryModel.find().exec();
  }

  async findOne(id: string): Promise<RepairServiceCategory> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Danh mục với ID ${id} không tồn tại`);
    }
    return category;
  }

  async update(
    id: string,
    dto: UpdateRepairServiceCategoryDto,
  ): Promise<RepairServiceCategory> {
    const updated = await this.categoryModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Danh mục với ID ${id} không tồn tại`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Danh mục với ID ${id} không tồn tại`);
    }
  }
}
