import { Controller, Post, Body, Get } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpType } from 'src/common/enums/otp';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('register-account')
  async registerAccountOtp(
    @Body() body: { email: string; phone: string; purpose: OtpType },
  ) {
    await this.otpService.registerAccountOTP(
      body.email,
      body.phone,
      body.purpose,
    );
    return { message: 'OTP đã được gửi' };
  }

  @Post('request')
  async requestOtp(@Body() body: { email: string; purpose: OtpType }) {
    await this.otpService.generateOtp(body.email, body.purpose);
    return { message: 'OTP đã được gửi' };
  }

  @Post('verify')
  async verifyOtp(
    @Body() body: { email: string; code: string; purpose: OtpType },
  ) {
    const result = await this.otpService.verifyOtp(
      body.email,
      body.code,
      body.purpose,
    );
    return {
      message: 'OTP hợp lệ',
      data: result,
    };
  }
}
