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
  @IsOptional()
  districtCode: number;

  @IsString()
  @IsOptional()
  districts: string;

  @IsNumber()
  @IsOptional()
  wardCode: number;

  @IsString()
  @IsOptional()
  wards: string;

  @IsString()
  @IsOptional()
  street: string;

  @IsString()
  @IsOptional()
  postalCode: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
