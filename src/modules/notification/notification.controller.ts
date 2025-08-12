import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dtos/create.dto';
import { UpdateNotificationDto } from './dtos/update.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('')
  async createNotification(@Body() dto: CreateNotificationDto) {
    const data = await this.notificationService.create(dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-user')
  async getNotifications(@Request() req) {
    const data = await this.notificationService.getNotifications(
      req.user.userId,
    );
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Patch('read/:id')
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Get('')
  async getAllNotifications() {
    const data = await this.notificationService.getAllNotifications();
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get(':id')
  async getNotificationById(@Param('id') id: string) {
    const data = await this.notificationService.getNotificationById(id);
    if (!data) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        ResponseMessage.FILE_NOT_FOUND,
      );
    }
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Put(':id')
  async updateNotification(
    @Param('id') id: string,
    @Body() dto: UpdateNotificationDto,
  ) {
    const updatedData = await this.notificationService.updateNotification(
      id,
      dto,
    );
    if (!updatedData) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        ResponseMessage.FILE_NOT_FOUND,
      );
    }
    return createResponse(HttpStatus.OK, updatedData, ResponseMessage.UPDATE);
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string) {
    await this.notificationService.delete(id);
    return createResponse(HttpStatus.NO_CONTENT, null, ResponseMessage.DELETE);
  }
}
