// src/modules/checkout/checkout.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ZaloPayService } from './zalopay/zalopay.service';
import { VnpayService } from './vnpay/vnpay.service';
import { Request } from 'express';
@Controller('checkout')
export class CheckoutController {
  constructor(
    private readonly zaloPayService: ZaloPayService,
    private readonly vnpayService: VnpayService,
  ) {}
  @Post('zalopay')
  async createZaloOrder(
    @Body() body: { amount: number; orderId: string },
  ): Promise<any> {
    const { amount, orderId } = body;

    if (!amount || !orderId) {
      throw new HttpException(
        'Thiếu thông tin thanh toán',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.zaloPayService.createOrder(amount, orderId);
      return result;
    } catch (error) {
      console.error('Lỗi tạo đơn hàng ZaloPay:', error);
      throw new HttpException(
        'Không thể tạo đơn hàng ZaloPay',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('zalopay-customer-paid')
  async createOrderCustomer(
    @Body() body: { amount: number; orderId: string },
  ): Promise<any> {
    const { amount, orderId } = body;

    if (!amount || !orderId) {
      throw new HttpException(
        'Thiếu thông tin thanh toán',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.zaloPayService.createOrderCustomer(
        amount,
        orderId,
      );
      return result;
    } catch (error) {
      console.error('Lỗi tạo đơn hàng ZaloPay:', error);
      throw new HttpException(
        'Không thể tạo đơn hàng ZaloPay',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('zalo/callback')
  async zaloCallback(@Req() req: Request) {
    const payload = req.body?.data ? JSON.parse(req.body.data) : req.body;

    await this.zaloPayService.handleCallback(payload);

    return {
      message: 'Callback',
    };
  }
  @Post('vnpay')
  async createVnpayOrder(
    @Body() body: { amount: number; orderId: string },
  ): Promise<any> {
    const { amount, orderId } = body;

    if (!amount || !orderId) {
      throw new HttpException(
        'Thiếu thông tin thanh toán',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.vnpayService.createPaymentUrl(orderId, amount);
      return { vnpUrl: result }; // trả về URL để frontend redirect
    } catch (error) {
      console.error('Lỗi tạo đơn hàng VNPay:', error);
      throw new HttpException(
        'Không thể tạo đơn hàng VNPay',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
