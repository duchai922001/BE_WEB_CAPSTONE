import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsMongoId,
} from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsOptional()
  discountValue?: number;

  @IsString()
  @IsNotEmpty()
  @IsIn(['percent', 'cash'], {
    message: 'discountType must be either "percent" or "cash"',
  })
  discountType: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  createBy: string;

  @IsString()
  @IsOptional()
  mainImage?: string;

  @IsString()
  @IsOptional()
  rightImage?: string;

  @IsString()
  @IsOptional()
  LeftImage?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  listImage?: string[];

  @IsBoolean()
  @IsOptional()
  isDelete?: boolean;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  products?: string[];

  @IsMongoId()
  @IsNotEmpty()
  isSelectBy: string;
}
