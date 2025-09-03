import { IsOptional, IsString, IsIn, IsISO8601 } from 'class-validator';

export type Preset =
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'last_month'
  | 'this_month'
  | 'this_quarter'
  | 'this_year'
  | 'custom';

export class GetDashboardDto {
  @IsOptional()
  @IsIn([
    'today',
    'yesterday',
    'this_week',
    'last_month',
    'this_month',
    'this_quarter',
    'this_year',
    'custom',
  ])
  preset?: Preset;

  @IsOptional()
  @IsISO8601()
  start?: string;

  @IsOptional()
  @IsISO8601()
  end?: string;

  @IsOptional()
  @IsString()
  tz?: string;

  @IsOptional()
  @IsString()
  ordersDateField?: string;

  @IsOptional()
  @IsString()
  repairsDateField?: string;
}
