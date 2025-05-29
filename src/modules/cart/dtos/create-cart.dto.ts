import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCartDto {
  @IsString()
  @IsNotEmpty({ message: 'RoleId is required' })
  userId: string;

  @IsNumber()
  @IsOptional()
  status: number;
}
