import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCustomSlideDto, UpdateCustomSlideDto } from './custom-slide.dto';
import { CustomSlide, CustomSlideDocument } from './custom-slide.entity';

@Injectable()
export class CustomSlideService {
  constructor(
    @InjectModel(CustomSlide.name)
    private customSlideModel: Model<CustomSlideDocument>,
  ) {}

  async create(dto: CreateCustomSlideDto): Promise<CustomSlide> {
    const newSlide = new this.customSlideModel(dto);
    return newSlide.save();
  }

  async findAll(): Promise<CustomSlide[]> {
    return this.customSlideModel
      .find({ isDelete: false })
      .sort({ order: 1 })
      .exec();
  }

  async findOne(id: string): Promise<CustomSlide> {
    const slide = await this.customSlideModel.findById(id).exec();
    if (!slide || slide.isDelete) {
      throw new NotFoundException(`Slide với id ${id} không tồn tại`);
    }
    return slide;
  }

  async update(id: string, dto: UpdateCustomSlideDto): Promise<CustomSlide> {
    const updatedSlide = await this.customSlideModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (!updatedSlide) {
      throw new NotFoundException(`Không tìm thấy slide với id ${id}`);
    }
    return updatedSlide;
  }

  async remove(id: string): Promise<CustomSlide> {
    const deleted = await this.customSlideModel
      .findByIdAndUpdate(id, { isDelete: true }, { new: true })
      .exec();

    if (!deleted) {
      throw new NotFoundException(`Không tìm thấy slide với id ${id}`);
    }
    return deleted;
  }
}
