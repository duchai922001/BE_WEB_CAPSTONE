import { IsString } from 'class-validator';

export class CreateInstalmentCartDto {
  @IsString()
  userId: string;
}
