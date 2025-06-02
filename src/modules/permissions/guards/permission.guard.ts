import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserPermission } from 'src/common/enums/permission';
import { PERMISSION_KEYS } from '../permission.decorator';


@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<UserPermission[]>(
      PERMISSION_KEYS,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // Không yêu cầu permission nào thì pass luôn
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const userPermissions: UserPermission[] = user?.permission ?? [];

    const hasPermission = requiredPermissions.some((perm) =>
      userPermissions.includes(perm),
    );

    if (!hasPermission) {
      throw new ForbiddenException('Bạn không có quyền truy cập');
    }

    return true;
  }
}
