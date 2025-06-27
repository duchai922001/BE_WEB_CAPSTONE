import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';

export class AddPermissionsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  permissionId: string[];
}
