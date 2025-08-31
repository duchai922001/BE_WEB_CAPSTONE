import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { ProductRepository } from '../product/product.repository';
import { NotificationService } from '../notification/notification.service';
import { NotificationGateway } from '../notification/notification.gateway';
import { UserRepository } from '../users/user.repository';
import { NotificationType } from 'src/common/enums/notification-type';

@Injectable()
export class JobsService implements OnModuleInit {
  private readonly logger = new Logger(JobsService.name);
  private lowStockRunning = false;

  constructor(
    private readonly productRepo: ProductRepository,
    private readonly userRepo: UserRepository,
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  onModuleInit() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((job, name) => {
      const nextRaw = (job as any).nextDates?.();
      const nextDate: Date | undefined =
        nextRaw?.toJSDate?.() ??
        nextRaw?.toDate?.() ??
        (nextRaw instanceof Date ? nextRaw : undefined);
      const printable = nextDate
        ? nextDate.toISOString()
        : String(nextRaw ?? 'unknown');
      this.logger.log(`[cron] "${name}" next run: ${printable}`);
    });
  }

  @Cron('0 0 22 * * *', {
    name: 'lowStockAlert',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async lowStockAlert() {
    if (this.lowStockRunning) return;
    this.lowStockRunning = true;

    const threshold = 3;
    const maxLinesPerGroup = 20;

    try {
      const products = await this.productRepo.findLowStock(threshold);
      if (!products?.length) {
        this.logger.log('[lowStockAlert] Không có sản phẩm gần/hết hàng');
        return;
      }

      const admins = await this.userRepo.findAdmins();
      if (!admins?.length) {
        this.logger.warn('[lowStockAlert] Không có admin để nhận thông báo');
        return;
      }

      const outOfStock = products.filter((p) => (p.stock ?? 0) <= 0);
      const lowStock = products.filter((p) => (p.stock ?? 0) > 0);

      const formatList = (arr: any[]) =>
        arr
          .slice(0, maxLinesPerGroup)
          .map((p) => {
            const code =
              p.barcode ??
              (typeof p._id?.toString === 'function' ? p._id.toString() : '');
            const qty = p.stock ?? 0;
            return `• ${p.name}${code ? ` (${code})` : ''} — còn ${qty}`;
          })
          .join('\n');

      const parts: string[] = [];
      if (outOfStock.length) {
        parts.push(
          `Hết hàng (${outOfStock.length}):\n${formatList(outOfStock)}` +
            (outOfStock.length > maxLinesPerGroup
              ? `\n… và ${outOfStock.length - maxLinesPerGroup} sản phẩm khác`
              : ''),
        );
      }
      if (lowStock.length) {
        parts.push(
          `Gần hết (<${threshold}) (${lowStock.length}):\n${formatList(lowStock)}` +
            (lowStock.length > maxLinesPerGroup
              ? `\n… và ${lowStock.length - maxLinesPerGroup} sản phẩm khác`
              : ''),
        );
      }

      const message = parts.join('\n\n');
      const title = `Cảnh báo tồn kho: ${products.length} sản phẩm thấp`;

      await Promise.all(
        admins.map(async (admin: any) => {
          const notif = await this.notificationService.create({
            userId: admin._id.toString(),
            title,
            message,
            type: NotificationType.INVENTORY,
            targetUrl: '/permission/manage-products',
          });
          this.notificationGateway.sendNotification(
            admin._id.toString(),
            notif,
          );
        }),
      );

      this.logger.warn(
        `[lowStockAlert] Đã gửi thông báo gộp (${products.length} sp) tới ${admins.length} admin`,
      );
    } catch (e) {
      this.logger.error('[lowStockAlert] Lỗi khi gửi thông báo', e);
    } finally {
      this.lowStockRunning = false;
    }
  }
}
