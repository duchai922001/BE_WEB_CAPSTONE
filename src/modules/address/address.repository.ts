import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address, AddressDocument } from './address.entity';
import { CreateAddressDto } from './dtos/create.dto';
import { UpdateAddressDto } from './dtos/update.dto';

@Injectable()
export class AddressRepository {
  constructor(
    @InjectModel(Address.name)
    private readonly addressModel: Model<AddressDocument>,
  ) {}

  async create(data: CreateAddressDto): Promise<AddressDocument> {
    const newAddress = new this.addressModel(data);
    return newAddress.save();
  }

  async findById(id: string): Promise<AddressDocument | null> {
    return this.addressModel.findById({ _id: id }).exec();
  }

  async findByUserId(userId: string): Promise<AddressDocument[]> {
    return this.addressModel.find({ userId }).exec();
  }

  async findAll(): Promise<AddressDocument[]> {
    return this.addressModel.find().exec();
  }

  async updateById(
    id: string,
    data: UpdateAddressDto,
  ): Promise<AddressDocument | null> {
    return this.addressModel.findByIdAndUpdate({_id: id}, data, { new: true }).exec();
  }

  async deleteById(id: string): Promise<void> {
    await this.addressModel.findByIdAndDelete(id).exec();
  }
}
