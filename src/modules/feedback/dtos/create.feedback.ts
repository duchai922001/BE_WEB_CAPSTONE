import {
  IsMongoId,
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';

export class CreateFeedbackDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsMongoId()
  @IsOptional()
  productId: string;

  @IsMongoId()
  @IsOptional()
  repairRequestId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
