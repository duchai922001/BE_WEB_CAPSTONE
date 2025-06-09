import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PermissionSystem } from 'src/common/enums/permission';

export class CreatePermissionDto {
  @IsEnum(PermissionSystem)
  name: PermissionSystem;

  @IsOptional()
  @IsString()
  description?: string;
}
