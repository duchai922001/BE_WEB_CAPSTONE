import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { permission } from 'process';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
        secretOrKey: process.env.JWT_ACCESS_SECRET as string,
        jwtFromRequest: ExtractJwt.fromExtractors([
            (req) => {
                const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
                console.log('Bearer Token in request:', token);
                return token;
              },
        ])
    });
  }

  async validate(payload: any) {
    console.log('validate() được gọi với payload:', payload);
    return {
        userId: payload.sub,
        phone: payload.phone,
        role: payload.role,
        permission: payload.permission,
      };
  }
}
