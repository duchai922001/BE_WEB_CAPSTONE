import { PartialType } from "@nestjs/mapped-types";
import { CreatePermissionDto } from "./create-permisson.dto";

export class UpdatePermissionDto extends PartialType(CreatePermissionDto){}