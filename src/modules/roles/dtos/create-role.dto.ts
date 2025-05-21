import { IsEnum, IsOptional, IsString } from "class-validator";
import { UserRole } from "src/common/enums/role";

export class CreateRoleDto {
    @IsEnum(UserRole)
    name: UserRole;
  
    @IsOptional()
    @IsString()
    description?: string;
  }