import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateBrandDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  image: string;
}
