import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleSystem } from 'src/common/enums/role';
import { ROLES_KEY } from '../role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleSystem[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; 
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Bạn không có quyền truy cập');
    }
    return true;
  }
}
