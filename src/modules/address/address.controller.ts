import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dtos/create.dto';
import { UpdateAddressDto } from './dtos/update.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getAddressByUserId(@Request() req) {
    const data = await this.addressService.getAddressByUserId(req.user.userId);
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

  @Get('user/:userId/default')
  async getUserDefaultAddress(@Param('userId') userId: string) {
    const data = await this.addressService.getDefaultAddressByUserId(userId);
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
