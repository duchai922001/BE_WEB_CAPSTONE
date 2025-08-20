import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserRepository } from 'src/modules/users/user.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from 'src/modules/roles/role.entity';

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
    const { id, emails, displayName, photos } = profile;

    let user = await this.userRepo.findUserByGoogleId(id);

    if (!user) {
      const defaultRole = await this.roleModel.findOne({ name: 'CUSTOMER' });
      if (!defaultRole) throw new Error('Role CUSTOMER chưa tồn tại trong DB');

      user = await this.userRepo.createGoogleUser({
        googleId: id,
        email: emails[0].value,
        fullName: displayName,
        avatar: photos[0]?.value,
        roleId: defaultRole._id.toString(),
      });
    }

    done(null, user);
  }
}
