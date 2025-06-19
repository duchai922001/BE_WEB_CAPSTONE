import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Otp, OtpDocument } from './otp.entity';
import { Model } from 'mongoose';
import { CreateOtpDto } from './dtos/create-otp.dto';
import { OtpType } from 'src/common/enums/otp';

@Injectable()
export class OtpRepository {
  constructor(
    @InjectModel(Otp.name)
    private readonly otpModel: Model<OtpDocument>,
  ) {}

  async createOtp(dto: CreateOtpDto): Promise<OtpDocument> {
    const otp = new this.otpModel({
      ...dto,
      expiresAt: new Date(dto.expiresAt),
    });
    return otp.save();
  }

  async findValidOtp(
    email: string,
    code: string,
    purpose: OtpType,
  ): Promise<OtpDocument | null> {
    return this.otpModel
      .findOne({
        email,
        code,
        purpose,
        isUsed: false,
        expiresAt: { $gt: new Date() },
      })
      .exec();
  }

  async markOtpAsUsed(id: string): Promise<void> {
    await this.otpModel.updateOne({ _id: id }, { isUsed: true }).exec();
  }
  async findLastOtp(
    email: string,
    purpose: OtpType,
  ): Promise<OtpDocument | null> {
    return this.otpModel
      .findOne({
        email,
        purpose,
      })
      .sort({ createdAt: -1 }) // Lấy OTP mới nhất
      .exec();
  }
}
