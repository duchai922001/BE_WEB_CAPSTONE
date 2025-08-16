import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateNotificationDto } from './dtos/create.dto';
import { Notification, NotificationDocument } from './notification.entity';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { NotificationType } from 'src/common/enums/notification-type';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async create(data: CreateNotificationDto): Promise<NotificationDocument> {
    const newNotification = new this.notificationModel(data);
    return newNotification.save();
  }

  async findById(id: string): Promise<NotificationDocument | null> {
    return this.notificationModel.findOne({ _id: id }).exec();
  }

  async findAll(): Promise<NotificationDocument[]> {
    return this.notificationModel.find().exec();
  }

  async deleteById(id: string): Promise<void> {
    await this.notificationModel.findByIdAndDelete(id).exec();
  }

  async updateById(
    id: string,
    data: Partial<CreateNotificationDto>,
  ): Promise<NotificationDocument | null> {
    return this.notificationModel
      .findByIdAndUpdate({ _id: id }, data, { new: true })
      .exec();
  }

  async getNotificationOrderByUser(
    userId: string | Types.ObjectId,
    limit = 20,
  ) {
    return this.notificationModel
      .find({ userId, type: NotificationType.ORDER })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
  async markAsRead(notificationId: string) {
    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true },
    );
  }
}
