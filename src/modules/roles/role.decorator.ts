import { SetMetadata } from "@nestjs/common";
import { RoleSystem } from "src/common/enums/role";

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleSystem[]) => SetMetadata(ROLES_KEY, roles);