import { PartialType } from '@nestjs/mapped-types';
import { CreateSpecificationsKeyDto } from './create-specifications-key.dto';

export class UpdateSpecificationsKeyDto extends PartialType(
  CreateSpecificationsKeyDto,
) {}
