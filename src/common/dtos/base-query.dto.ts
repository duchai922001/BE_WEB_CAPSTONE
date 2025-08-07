import {
  IsOptional,
  IsString,
  IsNumberString,
  IsObject,
} from 'class-validator';

export class BaseQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  select?: string;

  @IsOptional()
  @IsString()
  populate?: string;

  @IsOptional()
  @IsString()
  timeType?: string;

  @IsOptional()
  @IsObject()
  filters?: Record<string, string[]>;
}
