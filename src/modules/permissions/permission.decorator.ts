import { SetMetadata } from '@nestjs/common';
import { UserPermission } from 'src/common/enums/permission';

export const PERMISSION_KEYS = 'permissions';
export const Permissions = (...permissions: UserPermission[]) => SetMetadata(PERMISSION_KEYS, permissions);