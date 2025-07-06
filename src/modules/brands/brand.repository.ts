import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Brand, BrandDocument } from './brand.entity';
import { CreateBrandDto } from './dtos/create.dto';
import { UpdateBrandDto } from './dtos/update.dto';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { builderQuery } from 'src/common/helpers/query-builder.helper';

@Injectable()
export class BrandRepository {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<BrandDocument>,
  ) {}

  async findById(id: string): Promise<Brand | null> {
    return this.brandModel.findById(id);
  }

  async findByIds(brandIds: Types.ObjectId[]) {
    return this.brandModel.find({ _id: { $in: brandIds } }).exec();
  }

  async findByName(name: string): Promise<Brand | null> {
    return this.brandModel.findOne({
      name: { $regex: `^${name}$`, $options: 'i' },
    });
  }
  async create(data: CreateBrandDto): Promise<Brand> {
    const newBrand = new this.brandModel(data);
    return newBrand.save();
  }

  async getAll(query: BaseQueryDto): Promise<Brand[]> {
    const { filter, pagination, sort } = builderQuery(query);
    const finalFilter = {
      ...filter,
      isDelete: false,
    };

    const queryBuilder = this.brandModel
      .find(finalFilter)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort(sort as any);
    return queryBuilder.exec();
  }

  async update(id: string, data: UpdateBrandDto): Promise<Brand> {
    const brand = await this.brandModel
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .exec();

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return brand;
  }

  async delete(id: string): Promise<Brand> {
    const brand = await this.brandModel
      .findByIdAndUpdate(id, { isDelete: true }, { new: true })
      .exec();

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return brand;
  }

  async findManyByIds(brandIds: string[]): Promise<Brand[]> {
    const objectIds = brandIds.map((id) => new Types.ObjectId(id));
    return this.brandModel.find({ _id: { $in: objectIds } }).exec();
  }
}
