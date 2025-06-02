import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from 'src/common/enums/role';

export class CreateRoleDto {
  @IsEnum(UserRole)
  name: UserRole;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsMongoId({each: true})
  @IsNotEmpty({ message: 'permission Id is required' })
  permissionId: string[];
}
