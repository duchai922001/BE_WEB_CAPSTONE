import { IsString, IsNotEmpty } from 'class-validator';

export class CreateHashTagDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
