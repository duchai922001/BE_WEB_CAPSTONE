import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
    console.log('JwtAuthGuard instantiated');
  }
  canActivate(context: ExecutionContext) {
    console.log('JwtAuthGuard → canActivate gọi');
    return super.canActivate(context);
  }
}
