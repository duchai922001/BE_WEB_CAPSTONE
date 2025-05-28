import { IsNotEmpty, IsOptional, IsBoolean, IsString } from 'class-validator';

export class CreateInstalmentItemDto {
  @IsString()
  @IsNotEmpty()
  instalmentCartId: string;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
