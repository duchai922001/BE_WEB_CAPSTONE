import { DateTime } from 'luxon';
import { Preset } from './get-dashboard.dto';

export function getRange(
  preset: Preset | undefined,
  tz = 'Asia/Ho_Chi_Minh',
  startISO?: string,
  endISO?: string,
) {
  const now = DateTime.now().setZone(tz);

  const startOfWeek = () => now.startOf('week');
  const startOfQuarter = () =>
    DateTime.fromObject(
      {
        year: now.year,
        month: [1, 4, 7, 10][Math.floor((now.month - 1) / 3)],
        day: 1,
      },
      { zone: tz },
    ).startOf('day');

  let start: DateTime;
  let end: DateTime;

  switch (preset) {
    case 'today':
      start = now.startOf('day');
      end = now.endOf('day');
      break;
    case 'yesterday':
      start = now.minus({ days: 1 }).startOf('day');
      end = now.minus({ days: 1 }).endOf('day');
      break;
    case 'this_week':
      start = startOfWeek().startOf('day');
      end = now.endOf('day');
      break;
    case 'last_month':
      start = now.minus({ months: 1 }).startOf('month');
      end = now.minus({ months: 1 }).endOf('month');
      break;
    case 'this_month':
      start = now.startOf('month');
      end = now.endOf('day');
      break;
    case 'this_quarter':
      start = startOfQuarter();
      end = now.endOf('day');
      break;
    case 'this_year':
      start = now.startOf('year');
      end = now.endOf('day');
      break;
    case 'custom':
    default:
      if (!startISO || !endISO) {
        start = now.startOf('day');
        end = now.endOf('day');
      } else {
        start = DateTime.fromISO(startISO, { zone: tz });
        end = DateTime.fromISO(endISO, { zone: tz });
      }
  }

  return [start.toUTC().toJSDate(), end.toUTC().toJSDate()] as const;
}
