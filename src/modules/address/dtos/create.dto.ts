import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsMongoId,
} from 'class-validator';

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
  provinces: string;

  @IsString()
  @IsNotEmpty()
  districts: string;

  @IsString()
  @IsNotEmpty()
  wards: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
