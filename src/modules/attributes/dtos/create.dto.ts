import { IsMongoId, IsString, IsNotEmpty } from 'class-validator';

export class CreateAttributeDto {
  @IsMongoId()
  @IsNotEmpty()
  variableId: string;

  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}
