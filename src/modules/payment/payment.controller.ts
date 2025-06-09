import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { CreatePaymentDto } from './dtos/payment-create.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('')
  async createPayment(@Body() dto: CreatePaymentDto) {
    const data = await this.paymentService.create(dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get('')
  async getAllPayments() {
    const data = await this.paymentService.getAllPayments();
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get(':id')
  async getPaymentById(@Param('id') id: string) {
    const data = await this.paymentService.getPaymentById(id);
    if (!data) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        ResponseMessage.FILE_NOT_FOUND,
      );
    }
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get('order/:orderId')
  async getPaymentsByOrderId(@Param('orderId') orderId: string) {
    const data = await this.paymentService.getPaymentsByOrderId(orderId);
    if (!data || data.length === 0) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        ResponseMessage.FILE_NOT_FOUND,
      );
    }
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get('repairRequest/:repairRequestId')
  async getPaymentsByRepairRequestId(
    @Param('repairRequestId') repairRequestId: string,
  ) {
    const data =
      await this.paymentService.getPaymentsByRepairRequestId(repairRequestId);
    if (!data || data.length === 0) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        ResponseMessage.FILE_NOT_FOUND,
      );
    }
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Delete(':id')
  async deletePayment(@Param('id') id: string) {
    await this.paymentService.delete(id);
    return createResponse(HttpStatus.NO_CONTENT, null, ResponseMessage.DELETE);
  }
}
