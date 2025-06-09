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

  async updateAddress(
    id: string,
    data: UpdateAddressDto,
  ): Promise<Address | null> {
    const updatedAddress = await this.addressRepository.updateById(id, data);
    if (!updatedAddress) {
      return null;
    }
    return updatedAddress;
  }

  async delete(id: string): Promise<void> {
    return await this.addressRepository.deleteById(id);
  }
}
