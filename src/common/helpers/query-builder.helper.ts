import { BaseQueryDto } from '../dtos/base-query.dto';

export function builderQuery(query: BaseQueryDto) {
  const page = parseInt(query.page ?? '1', 10);
  const limit = parseInt(query.limit ?? '10', 10);
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (query.keyword) {
    const regex = { $regex: query.keyword, $options: 'i' };
    filter.$or = [{ name: regex }, { description: regex }, { serials: regex }];
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
