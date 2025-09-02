import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Specifications,
  SpecificationsDocument,
} from './specifications.entity';
import {
  CreateSpecificationDto,
  UpdateSpecificationDto,
} from './dto/specifications.dto';
import {
  SpecificationsKey,
  SpecificationsKeyDocument,
} from '../specifications-key/specifications-key.entity';

@Injectable()
export class SpecificationsRepository {
  constructor(
    @InjectModel(SpecificationsKey.name)
    private specKeyModel: Model<SpecificationsKeyDocument>,
    @InjectModel(Specifications.name)
    private model: Model<SpecificationsDocument>,
  ) {}

  async createBulk(data: CreateSpecificationDto[]) {
    return this.model.insertMany(data);
  }

  async findByProductId(productId: string) {
    return this.model.find({ productId }).exec();
  }

  async getAll(): Promise<Specifications[]> {
    return this.model.find().populate('productId').exec();
  }

  async getById(id: string): Promise<Specifications | null> {
    return this.model.findById(id).exec();
  }

  async update(id: string, data: UpdateSpecificationDto) {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async getFilterableSpecifications() {
    const keys = await this.specKeyModel.find({ isFilter: true }).lean();

    const results = await Promise.all(
      keys.map(async (keyDoc) => {
        const values = await this.model
          .find({ key: keyDoc.key })
          .distinct('value');
        return {
          key: keyDoc.key,
          values,
        };
      }),
    );

    return results;
  }

  async findMatchedProductIdsBySpecifications(
    productIds: string[],
    filters: Record<string, string[]>,
  ): Promise<string[]> {
    const matched = await this.model.aggregate([
      {
        $match: {
          productId: { $in: productIds.map((id) => new Types.ObjectId(id)) },
          $or: Object.entries(filters).map(([key, values]) => ({
            key,
            value: { $in: values },
          })),
        },
      },
      {
        $group: {
          _id: '$productId',
          totalMatched: { $sum: 1 },
        },
      },
      {
        $match: {
          totalMatched: Object.keys(filters).length,
        },
      },
    ]);

    return matched.map((m) => m._id.toString());
  }

  async getFilteredProductIds(
    productIds: string[],
    filters: { key: string; value?: string[] }[],
  ): Promise<string[]> {
    if (!filters || filters.length === 0) return productIds;

    const specs = await this.model.find({
      productId: { $in: productIds },
    });

    return productIds.filter((id) => {
      // lấy specs của sản phẩm này
      const specsOfProduct = specs.filter((s) => s.productId.toString() === id);

      // OR logic: chỉ cần một filter key trùng với một value
      return filters.some((f) => {
        if (!f.value || f.value.length === 0) return false;
        return specsOfProduct.some(
          (s) => s.key === f.key && f.value!.includes(s.value),
        );
      });
    });
  }
}
