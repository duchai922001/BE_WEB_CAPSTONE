import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomBanner, CustomBannerDocument } from './custom-banner.schema';
import {
  CreateCustomBannerDto,
  UpdateCustomBannerDto,
} from './custom-banner.dto';

@Injectable()
export class CustomBannerService {
  constructor(
    @InjectModel(CustomBanner.name)
    private bannerModel: Model<CustomBannerDocument>,
  ) {}

  async findAll(): Promise<CustomBanner[]> {
    return this.bannerModel.find({ isDelete: false }).sort({ order: 1 }).exec();
  }

  async create(payload: CreateCustomBannerDto): Promise<CustomBanner> {
    const newBanner = new this.bannerModel(payload);
    return newBanner.save();
  }

  async update(
    id: string,
    payload: UpdateCustomBannerDto,
  ): Promise<CustomBanner> {
    const banner = await this.bannerModel.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!banner) throw new NotFoundException(`Banner ${id} không tồn tại`);
    return banner;
  }

  async delete(id: string): Promise<void> {
    const banner = await this.bannerModel.findByIdAndUpdate(id, {
      isDelete: true,
    });
    if (!banner) throw new NotFoundException(`Banner ${id} không tồn tại`);
  }
}
