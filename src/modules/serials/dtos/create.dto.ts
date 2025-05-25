import { IsMongoId, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateSerialDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @IsMongoId()
  @IsNotEmpty()
  @IsOptional()
  variableId: string;

  @IsString()
  @IsNotEmpty()
  serialCode: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;
}
