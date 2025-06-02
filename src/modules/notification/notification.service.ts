import { UpdateNotificationDto } from './dtos/update.dto';
import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';
import { CreateNotificationDto } from './dtos/create.dto';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async create(data: CreateNotificationDto): Promise<Notification> {
    const { userId, title, message, type, targeUrl } = data;
    const notification = await this.notificationRepository.create({
      userId,
      title,
      message,
      type,
      targeUrl,
    });
    return notification;
  }

  async getNotificationById(id: string): Promise<Notification | null> {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      return null;
    }
    return notification;
  }

  async getAllNotifications(): Promise<Notification[]> {
    return this.notificationRepository.findAll();
  }

  async updateNotification(
    id: string,
    data: UpdateNotificationDto,
  ): Promise<Notification | null> {
    const updatedNotification = await this.notificationRepository.updateById(id, data);
    if (!updatedNotification) {
      return null;
    }
    return updatedNotification;
  }

  async delete(id: string): Promise<void> {
    return await this.notificationRepository.deleteById(id);
  }
}
