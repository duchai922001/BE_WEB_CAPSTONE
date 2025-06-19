import { IsMongoId } from 'class-validator';

export class CreateFavoriteDto {
  @IsMongoId()
  userId: string;

  @IsMongoId()
  productId: string;
}
