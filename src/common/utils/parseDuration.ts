export function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)([dhm])$/i);
  if (!match) return 0;

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 'd':
      return value * 24 * 60 * 60 * 1000; // ngày → ms
    case 'h':
      return value * 60 * 60 * 1000; // giờ → ms
    case 'm':
      return value * 30 * 24 * 60 * 60 * 1000; // tháng (30 ngày) → ms
    default:
      return 0;
  }
}

export function formatTimeLeft(ms: number): string {
  if (ms <= 0) return 'Hết hạn';

  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));

  const parts: string[] = []; // <-- Khai báo rõ ràng là string[]
  if (days > 0) parts.push(`${days} ngày`);
  if (hours > 0) parts.push(`${hours} giờ`);
  if (minutes > 0) parts.push(`${minutes} phút`);

  return parts.join(' ');
}
