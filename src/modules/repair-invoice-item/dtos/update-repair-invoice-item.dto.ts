import { PartialType } from '@nestjs/mapped-types';
import { CreateRepairInvoiceItemDto } from './create-repair-invoice-item.dto';

export class UpdateRepairInvoiceItemDto extends PartialType(
  CreateRepairInvoiceItemDto,
) {}
