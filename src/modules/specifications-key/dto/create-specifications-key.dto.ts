import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateSpecificationsKeyDto {
  @IsString()
  key: string;

  @IsOptional()
  @IsBoolean()
  isFilter?: boolean;
}
