import { IsMongoId, IsString, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAttributeDto {
  @IsMongoId()
  @IsNotEmpty()
  variableId: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}
