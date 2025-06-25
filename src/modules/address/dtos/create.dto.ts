import { IsString, IsBoolean, IsOptional, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateAddressDto {
  @IsMongoId()
  @IsOptional()
  userId: string;

  @IsString()
  @IsNotEmpty()
  receiverName: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  fullAddress: string;

  @IsBoolean()
  @IsOptional() 
  isDefault?: boolean;
}