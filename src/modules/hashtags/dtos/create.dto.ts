import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateSerialDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  variableId?: string;

  @IsString()
  @IsNotEmpty()
  serialCode: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;
}
