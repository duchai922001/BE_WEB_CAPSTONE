import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
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
