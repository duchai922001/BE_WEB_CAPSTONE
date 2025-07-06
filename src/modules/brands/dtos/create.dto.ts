import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty({ message: 'Name is require' })
  name: string;

  @IsString()
  image: string;
}
