import {
  IsMongoId,
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateFeedbackDto {
  @IsMongoId()
  userId: string;

  @IsMongoId()
  productId: string;

  @IsMongoId()
  repairRequestId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
