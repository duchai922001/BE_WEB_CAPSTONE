import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserPermission } from 'src/common/enums/permission';

export class CreatePermissionDto {
  @IsEnum(UserPermission)
  name: UserPermission;

  @IsOptional()
  @IsString()
  description?: string;

}
