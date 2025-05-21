import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { Token, TokenDocument } from './auth.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
  ) {}

  async login(phone: string, password: string) {
    const user = await this.userService.validateUser(phone, password);

    console.log('role trong payload o auth service', user.roleId.name);
    const payload = {
      sub: user._id,
      phone: user.phone,
      role: user.roleId.name,
    };

    const accessToken = this.jwtService.sign(payload, {
        expiresIn: '15m',
        secret: process.env.JWT_ACCESS_SECRET,
      });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESH_SECRET,
    });

    await this.tokenModel.create({
      userId: user._id,
      refreshToken,
    });

    return { accessToken, refreshToken, user };
  }
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const tokenDoc = await this.tokenModel.findOne({
        userId: payload.sub,
        refreshToken,
        isRevoked: false,
      });

      if (!tokenDoc) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = this.jwtService.sign(
        { sub: payload.sub, phone: payload.phone, role: payload.role },
        { expiresIn: '15m' },
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Token verification failed');
    }
  }
  async logout(userId: string, refreshToken: string): Promise<void> {
    const result = await this.tokenModel.findOneAndUpdate(
      { userId, refreshToken, isRevoked: false },
      { isRevoked: true }
    );
  
    if (!result) {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã bị thu hồi');
    }
  }
  async isAccessTokenValid(token: string): Promise<boolean> {
    try {
      // Xác thực token với secret key của access token
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      return true;
    } catch (error) {
      return false;
    }
  }
  
}
