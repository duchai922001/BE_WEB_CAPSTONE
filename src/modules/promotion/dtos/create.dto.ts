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
import { PromotionImageType } from 'src/common/enums/promotionImage';
export class CreatePromotionImageDto {
  @IsNotEmpty()
  @IsString()
  url: string;

  @IsEnum(PromotionImageType)
  @IsNotEmpty()
  type: PromotionImageType;
}
export class CreatePromotionDto {
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  @ArrayUnique()
  products?: string[];

  @IsArray()
  promotionImages?: CreatePromotionImageDto[];

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
  discountValue?: number;

  @IsEnum(PromotionDiscountType)
  discountType: PromotionDiscountType;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
