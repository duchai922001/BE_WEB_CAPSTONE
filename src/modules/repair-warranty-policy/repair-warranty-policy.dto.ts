import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRepairWarrantyPolicyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateRepairWarrantyPolicyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
