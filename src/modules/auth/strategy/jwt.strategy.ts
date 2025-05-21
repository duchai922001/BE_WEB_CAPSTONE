import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
        secretOrKey: configService.get<string>('JWT_ACCESS_SECRET') as string,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),      
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
