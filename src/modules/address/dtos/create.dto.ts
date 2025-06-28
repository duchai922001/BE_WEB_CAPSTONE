import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsMongoId,
  IsNumber,
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

  @IsNumber()
  @IsNotEmpty()
  provinceCode: number;

  @IsString()
  @IsNotEmpty()
  provinces: string;

  @IsNumber()
  @IsNotEmpty()
  districtCode: number;

  @IsString()
  @IsNotEmpty()
  districts: string;

  @IsNumber()
  @IsNotEmpty()
  wardCode: number;

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
