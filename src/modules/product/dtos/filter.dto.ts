// src/modules/product/dto/filter-product.dto.ts
import { IsOptional, IsString, IsArray, IsNumber } from 'class-validator';

export class FilterItemDto {
  @IsString()
  key: string;

  @IsString({ each: true })
  @IsOptional()
  value?: string[];
}

export class FilterProductDto {
  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsArray()
  filters?: FilterItemDto[];

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  fromPrice?: number;

  @IsOptional()
  @IsNumber()
  toPrice?: number;
}
