import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEYS } from '../permission.decorator';
import { UserPermission } from 'src/common/enums/permission';

@Injectable()
export class PermissonsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissons = this.reflector.getAllAndOverride<UserPermission[]>(
      PERMISSION_KEYS,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissons || requiredPermissons.length === 0) {
      return true; 
    }
    
    const request = context.switchToHttp().getRequest();
    console.log('Authorization header:', request.headers['authorization']);
    const user = request.user;

    console.log('Request User:', request.user);
    if (!user || !user.permission || !requiredPermissons.includes(user.permission)) {
      console.log('User in request:', user);
      throw new ForbiddenException('Bạn không có quyền truy cập');
    }
    return true;
  }
}
