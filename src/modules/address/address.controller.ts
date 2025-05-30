import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dtos/create.dto';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { UpdateAddressDto } from './dtos/update.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post('')
  async createAddress(@Body() dto: CreateAddressDto) {
    const data = await this.addressService.create(dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get('')
  async getAllAddresses() {
    const data = await this.addressService.getAllAddresses();
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get(':userId')
  async getAddressByUserId(@Param('userId') userId: string) {
    const data = await this.addressService.getAddressByUserId(userId);
    if (!data || data.length === 0) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        ResponseMessage.FILE_NOT_FOUND,
      );
    }
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get(':id')
  async getAddressById(@Param('id') id: string) {
    const data = await this.addressService.getAddressById(id);
    if (!data) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        ResponseMessage.FILE_NOT_FOUND,
      );
    }
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Put(':id')
  async updateAddress(@Param('id') id: string, @Body() dto: UpdateAddressDto) {
    const updatedAddress = await this.addressService.updateAddress(id, dto);
    if (!updatedAddress) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        ResponseMessage.FILE_NOT_FOUND,
      );
    }
    return createResponse(
      HttpStatus.OK,
      updatedAddress,
      ResponseMessage.UPDATE,
    );
  }

  @Delete(':id')
  async deleteAddress(@Param('id') id: string) {
    const data = await this.addressService.delete(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.DELETE);
  }
}
