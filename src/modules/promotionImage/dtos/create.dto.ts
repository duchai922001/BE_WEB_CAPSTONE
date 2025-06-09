import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { PromotionImageType } from 'src/common/enums/promotionImage';

export class CreatePromotionImageDto {
  @IsNotEmpty()
  @IsMongoId()
  promotionId: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsEnum(PromotionImageType)
  @IsNotEmpty()
  type: PromotionImageType;
}
