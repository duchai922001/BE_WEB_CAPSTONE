import {
  IsOptional,
  IsNumber,
  Min,
  IsArray,
  ValidateNested,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SerialCodeDto } from 'src/modules/product/dtos/update.dto';

export class UpdateVariableDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  costPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sellPrice?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SerialCodeDto)
  serialCodes?: SerialCodeDto[];
}
