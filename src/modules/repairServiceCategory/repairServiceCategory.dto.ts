import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRepairServiceCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is require' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Icon is require' })
  icon: string;

  @IsString()
  @IsOptional()
  url: string;
}

export class UpdateRepairServiceCategoryDto extends PartialType(
  CreateRepairServiceCategoryDto,
) {}
