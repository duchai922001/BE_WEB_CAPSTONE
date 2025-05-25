import { BaseQueryDto } from '../dtos/base-query.dto';
import * as dayjs from 'dayjs';

function getDateRange(timeType?: string) {
  const today = dayjs().startOf('day');

  switch (timeType) {
    case 'today':
      return { from: today.toDate(), to: today.endOf('day').toDate() };
    case 'yesterday':
      return {
        from: today.subtract(1, 'day').toDate(),
        to: today.subtract(1, 'day').endOf('day').toDate(),
      };
    case 'this_week':
      return {
        from: today.startOf('week').toDate(),
        to: today.endOf('week').toDate(),
      };
    case 'last_week':
      return {
        from: today.subtract(1, 'week').startOf('week').toDate(),
        to: today.subtract(1, 'week').endOf('week').toDate(),
      };
    case 'this_month':
      return {
        from: today.startOf('month').toDate(),
        to: today.endOf('month').toDate(),
      };
    case 'last_month':
      return {
        from: today.subtract(1, 'month').startOf('month').toDate(),
        to: today.subtract(1, 'month').endOf('month').toDate(),
      };
    case 'last_3_months':
      return {
        from: today.subtract(3, 'month').startOf('month').toDate(),
        to: today.endOf('month').toDate(),
      };
    case 'last_6_months':
      return {
        from: today.subtract(6, 'month').startOf('month').toDate(),
        to: today.endOf('month').toDate(),
      };
    case 'this_year':
      return {
        from: today.startOf('year').toDate(),
        to: today.endOf('year').toDate(),
      };
    case 'last_year':
      return {
        from: today.subtract(1, 'year').startOf('year').toDate(),
        to: today.subtract(1, 'year').endOf('year').toDate(),
      };
    default:
      return null;
  }
}
export function builderQuery(
  query: BaseQueryDto,
  options?: { withDeletedFilter?: boolean },
  extraFilters?: Record<string, any>,
) {
  const page = parseInt(query.page ?? '1', 10);
  const limit = parseInt(query.limit ?? '10', 10);
  const skip = (page - 1) * limit;

  const filter: any = {};

  if (options?.withDeletedFilter) {
    filter.isDeleted = false;
  }
  if (query.keyword) {
    const regex = { $regex: query.keyword, $options: 'i' };
    filter.$or = [
      { name: regex },
      { description: regex },
      { serials: regex },
      { fullName: regex },
      { email: regex },
    ];
  }

  const dateRange = getDateRange(query.timeType);
  if (dateRange) {
    filter.createdAt = {
      $gte: dateRange.from,
      $lte: dateRange.to,
    };
  }

  if (extraFilters) {
    for (const key in extraFilters) {
      if (key === 'createdAt' || key === 'isDeleted') {
        continue;
      }
      const value = extraFilters[key];
      if (Array.isArray(value)) {
        if (value.length > 0) {
          filter[key] = { $in: value };
        }
      } else if (value !== undefined && value !== null) {
        filter[key] = value;
      }
    }
  }

  const sortField = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  const sort: Record<string, 1 | -1> = { [sortField]: sortOrder };

  const select = query.select?.split(',').join(' ');
  const populate = query.populate?.split(',') || [];

  return {
    filter,
    pagination: { skip, limit },
    sort,
    select,
    populate,
  };
}
