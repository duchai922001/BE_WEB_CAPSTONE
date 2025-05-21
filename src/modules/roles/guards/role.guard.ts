import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/common/enums/role';
import { ROLES_KEY } from '../role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; 
    }
    
    const request = context.switchToHttp().getRequest();
    console.log('Authorization header:', request.headers['authorization']);
    const user = request.user;

    console.log('Request User:', request.user);
    if (!user || !user.role || !requiredRoles.includes(user.role)) {
    //   console.log('request:', request);
      console.log('User in request:', user);
      throw new ForbiddenException('Bạn không có quyền truy cập');
    }
    return true;
  }
}
