import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RoleSystem } from 'src/common/enums/role';

export class CreateRoleDto {
  @IsEnum(RoleSystem)
  name: RoleSystem;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsMongoId({each: true})
  @IsNotEmpty({ message: 'permission Id is required' })
  permissionId: string[];
}
