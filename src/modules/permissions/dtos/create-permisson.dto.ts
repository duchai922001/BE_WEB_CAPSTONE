import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PermissionSystem } from 'src/common/enums/permission';
import { TableSystem } from 'src/common/enums/tableSystem';

export class CreatePermissionDto {
  @IsEnum(PermissionSystem)
  name: PermissionSystem;

  @IsEnum(TableSystem)
  table: TableSystem;

  @IsOptional()
  @IsString()
  description?: string;
}
