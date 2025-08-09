// src/modules/checkout/checkout.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { ZaloPayService } from './zalopay/zalopay.service';
import { VnpayService } from './vnpay/vnpay.service';
@Controller('checkout')
export class CheckoutController {
  private zaloPayService = new ZaloPayService();
  private vnpayService = new VnpayService();

  @Post('zalopay')
  async createZaloOrder(@Body() body: { amount: number }): Promise<any> {
    const { amount } = body;

    if (!amount) {
      throw new HttpException(
        'Thiếu thông tin thanh toán',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.zaloPayService.createOrder(amount);
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
  async zaloCallback(@Body() payload: any) {
    console.log('vaop day cho tao');
    const result = await this.zaloPayService.handleCallback(payload);

    // Trả về dữ liệu theo chuẩn ZaloPay để họ biết server bạn nhận được callback thành công
    return {
      returncode: result.success ? 1 : 0,
      returnmessage: result.message,
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
