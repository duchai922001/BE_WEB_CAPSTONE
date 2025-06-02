import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateAddressDto {
  @IsString()
  @IsOptional()
  receiverName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  fullAddress?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
