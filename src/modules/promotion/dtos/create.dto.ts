import {
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  Min,
  ArrayUnique,
} from 'class-validator';
import { PromotionDiscountType } from 'src/common/enums/promotion';

export class CreatePromotionDto {
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  @ArrayUnique()
  products?: string[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  promotionImages?: string[];

  @IsMongoId()
  @IsNotEmpty()
  createdBy: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discountValue?: number;

  @IsEnum(PromotionDiscountType)
  discountType: PromotionDiscountType;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}