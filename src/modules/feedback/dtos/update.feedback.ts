import { PartialType } from '@nestjs/mapped-types';
import { CreateFeedbackDto } from './create.feedback';

export class UpdateFeedbackDto extends PartialType(CreateFeedbackDto) {}
