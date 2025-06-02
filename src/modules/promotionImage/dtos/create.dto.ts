import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreatePromotionImageDto {
  @IsNotEmpty()
  @IsMongoId()
  promotionId: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}
