import { PartialType } from '@nestjs/mapped-types';
import { CreatePromotionDto } from './create.dto';

export class UpdatePromotionDto extends PartialType(CreatePromotionDto) {}
