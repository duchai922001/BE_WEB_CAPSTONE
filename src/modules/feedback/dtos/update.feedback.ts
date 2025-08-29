import {
  IsMongoId,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsString,
  IsOptional,
} from 'class-validator';

export class UpdateFeedbackDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
