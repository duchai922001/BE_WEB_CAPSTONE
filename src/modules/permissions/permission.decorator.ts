import { SetMetadata } from '@nestjs/common';
import { PermissionSystem } from 'src/common/enums/permission';

export const PERMISSION_KEYS = 'permissions';
export const Permissions = (...permissions: PermissionSystem[]) => SetMetadata(PERMISSION_KEYS, permissions);