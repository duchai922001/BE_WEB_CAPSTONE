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

@Injectable()
export class OtpService {
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly userRepository: UserRepository,
  ) {}
  private transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Hoặc server SMTP của bạn
    port: 587,
    secure: false, // true nếu dùng port 465
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

  async verifyOtp(
    email: string,
    code: string,
    purpose: OtpType,
  ): Promise<{ userId: string }> {
    const otp = await this.otpRepository.findValidOtp(email, code, purpose);
    if (!otp) {
      throw new BadRequestException('OTP is invalid or expired');
    }

    await this.otpRepository.markOtpAsUsed(otp._id.toString());

    // Lấy userId từ email (giả sử bạn có userRepository)
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng với email này');
    }

    return { userId: (user._id as Types.ObjectId).toString() };
  }
}
