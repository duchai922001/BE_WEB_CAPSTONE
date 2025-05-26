import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateProductImageDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsBoolean()
  @IsNotEmpty()
  isDefault: boolean;
}
