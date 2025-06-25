import { Injectable } from '@nestjs/common';
import { AddressRepository } from './address.repository';
import { CreateAddressDto } from './dtos/create.dto';
import { Address } from './address.entity';
import { UpdateAddressDto } from './dtos/update.dto';

@Injectable()
export class AddressService {
  constructor(private readonly addressRepository: AddressRepository) {}

  async create(data: CreateAddressDto): Promise<Address> {
    const { userId, receiverName, phone, fullAddress, isDefault } = data;

    if (isDefault) {
      await this.addressRepository.updateMany(
        { userId },
        { $set: { isDefault: false } },
      );
    }
    const address = await this.addressRepository.create({
      userId,
      receiverName,
      phone,
      fullAddress,
      isDefault,
    });
    return address;
  }

  async getAddressById(id: string): Promise<Address | null> {
    const address = await this.addressRepository.findById(id);
    if (!address) {
      return null;
    }
    return address;
  }

  async getAddressByUserId(userId: string): Promise<Address[]> {
    return this.addressRepository.findByUserId(userId);
  }

  async getAllAddresses(): Promise<Address[]> {
    return this.addressRepository.findAll();
  }
  async getDefaultAddressByUserId(userId: string): Promise<Address | null> {
    return this.addressRepository.findOne({
      userId,
      isDefault: true,
    });
  }

  async updateAddress(
    id: string,
    data: UpdateAddressDto,
  ): Promise<Address | null> {
    const existingAddress = await this.addressRepository.findById(id);
    if (!existingAddress) return null;

    // Nếu người dùng đang đặt địa chỉ này là mặc định
    if (data.isDefault) {
      // Đặt tất cả các địa chỉ khác của user về false
      await this.addressRepository.updateMany(
        { userId: existingAddress.userId, _id: { $ne: id } },
        { isDefault: false },
      );
    }

    // Cập nhật địa chỉ được chọn
    const updatedAddress = await this.addressRepository.updateById(id, data);
    return updatedAddress;
  }

  async delete(id: string): Promise<void> {
    return await this.addressRepository.deleteById(id);
  }
}
