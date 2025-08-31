import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserRepository } from 'src/modules/users/user.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role, RoleDocument } from 'src/modules/roles/role.entity';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { generateRandomPassword } from 'src/common/utils/generateRandomPassword';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly userRepo: UserRepository,
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        'https://be-web-bluetooth-v1.onrender.com/users/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      const googleId: string = profile.id;
      const email: string | null =
        (profile.emails?.[0]?.value as string | undefined)?.toLowerCase() ??
        null;
      const fullName: string = profile.displayName || '';
      const avatar: string | undefined = profile.photos?.[0]?.value;

      let user = await this.userRepo.findUserByGoogleId(googleId);

      if (user) return done(null, user);

      if (email) {
        const existingByEmail = await this.userRepo.findUserByEmail(email);
        if (existingByEmail) {
          const idStr = (existingByEmail._id as Types.ObjectId).toString();

          await this.userRepo.updateById(idStr, {
            googleId,
            ...(avatar && !existingByEmail.avatar ? { avatar } : {}),
            ...(fullName && !existingByEmail.fullName ? { fullName } : {}),
          });

          const updated = await this.userRepo.findById(idStr);
          return done(null, updated);
        }
      }

      const defaultRole = await this.roleModel.findOne({ name: 'CUSTOMER' });
      if (!defaultRole) {
        return done(new Error('Role CUSTOMER chưa tồn tại trong DB'), false);
      }

      const rawPassword = generateRandomPassword(6);
      const hashedPassword = await bcrypt.hash(rawPassword, 10);

      const payload: {
        googleId: string;
        fullName: string;
        roleId: string;
        email?: string;
        avatar?: string;
        password: string;
      } = {
        googleId,
        fullName,
        roleId: defaultRole._id.toString(),
        password: hashedPassword,
        ...(email ? { email } : {}),
        ...(avatar ? { avatar } : {}),
      };

      user = await this.userRepo.createGoogleUser(payload);
      const mailOptions = {
        from: `"Thông báo tạo tài khoản" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Thông báo mật khẩu khách hàng',
        html: `
          <h3>Xin chào ${fullName || ''}</h3>
          <p>Mật khẩu tài khoản bạn là: ${rawPassword}</p>
          <i>Bạn có thể vào trang thông tin để cập nhật mật khẩu</i>
         
        `,
      };
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      await transporter.sendMail(mailOptions);
      return done(null, user);
    } catch (err: any) {
      // Race condition khi unique index trùng
      if (err?.code === 11000) {
        const fallback = await this.userRepo.findUserByGoogleId(profile.id);
        if (fallback) return done(null, fallback);
      }
      return done(err, false);
    }
  }
}
