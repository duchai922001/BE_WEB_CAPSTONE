import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OtpRepository } from './otp.repository';
import { OtpType } from 'src/common/enums/otp';
import * as nodemailer from 'nodemailer';
import { OtpDocument } from './otp.entity';
import { UserRepository } from '../users/user.repository';
import { Types } from 'mongoose';
import { UserService } from '../users/user.service';

@Injectable()
export class OtpService {
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
  ) {}
  private transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  async generateOtp(email: string, purpose: OtpType): Promise<void> {
    const lastOtp = (await this.otpRepository.findLastOtp(
      email,
      purpose,
    )) as OtpDocument & { createdAt: Date };

    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException(
        'Người dùng không có trong hệ thống, vui lòng kiểm tra lại',
      );
    }

    if (
      lastOtp &&
      new Date(lastOtp.createdAt).getTime() > Date.now() - 60 * 1000
    ) {
      throw new BadRequestException(
        'Bạn vừa yêu cầu OTP. Vui lòng chờ 60 giây trước khi gửi lại.',
      );
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 chữ số
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

    await this.otpRepository.createOtp({
      email,
      code,
      purpose,
      expiresAt: expiresAt.toISOString(),
    });

    await this.transporter.sendMail({
      from: '"Bluetooth Mobile" khangnvmse171448@fpt.edu.vn', // Tên hiển thị + email
      to: email,
      subject: `Mã OTP của bạn`,
      text: `Mã OTP của bạn là: ${code}. Có hiệu lực trong 10 phút.`,
      html: `<p>Mã OTP của bạn là: <b>${code}</b></p><p>Có hiệu lực trong 10 phút.</p>`,
    });

    console.log(`Sent OTP ${code} to ${email}`);
  }
  async registerAccountOTP(
    email: string,
    phone: string,
    purpose: OtpType,
  ): Promise<void> {
    const lastOtp = (await this.otpRepository.findLastOtp(
      email,
      purpose,
    )) as OtpDocument & { createdAt: Date };

    const user = await this.userService.getUserByEmailOrPhone(email, phone);
    if (user) {
      throw new BadRequestException(
        'Email hoặc số điện thoại người dùng đã tồn tại',
      );
    }

    if (
      lastOtp &&
      new Date(lastOtp.createdAt).getTime() > Date.now() - 60 * 1000
    ) {
      throw new BadRequestException(
        'Bạn vừa yêu cầu OTP. Vui lòng chờ 60 giây trước khi gửi lại.',
      );
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 chữ số
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

    await this.otpRepository.createOtp({
      email,
      code,
      purpose,
      expiresAt: expiresAt.toISOString(),
    });

    await this.transporter.sendMail({
      from: '"Bluetooth Mobile" khangnvmse171448@fpt.edu.vn', // Tên hiển thị + email
      to: email,
      subject: `Mã OTP của bạn`,
      text: `Mã OTP của bạn là: ${code}. Có hiệu lực trong 10 phút.`,
      html: `<p>Mã OTP của bạn là: <b>${code}</b></p><p>Có hiệu lực trong 10 phút.</p>`,
    });
  }
  async verifyOtp(
    email: string,
    code: string,
    purpose: OtpType,
  ): Promise<{ userId: string }> {
    const otp = await this.otpRepository.findValidOtp(email, code, purpose);
    if (!otp) {
      throw new BadRequestException('OTP không đúng hoặc đã hết hạn');
    }

    await this.otpRepository.markOtpAsUsed(otp._id.toString());

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      if (purpose !== OtpType.REGISTER_ACCOUNT) {
        throw new NotFoundException('Không tìm thấy người dùng với email này');
      } else {
        return { userId: '' }; // hoặc xử lý logic cho REGISTER_ACCOUNT
      }
    }

    return { userId: (user._id as Types.ObjectId).toString() };
  }
}
