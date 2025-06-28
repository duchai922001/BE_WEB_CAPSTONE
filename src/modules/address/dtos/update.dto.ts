import { IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class UpdateAddressDto {
  @IsString()
  @IsOptional()
  receiverName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsNumber()
  @IsOptional()
  provinceCode?: number;

  @IsString()
  @IsOptional()
  provinces?: string;

  @IsNumber()
  @IsOptional()
  districtCode?: number;

  @IsString()
  @IsOptional()
  districts?: string;

  @IsNumber()
  @IsOptional()
  wardCode?: number;

  @IsString()
  @IsOptional()
  wards?: string;

  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
