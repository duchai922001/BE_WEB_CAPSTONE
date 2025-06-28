// src/modules/favorites/favorite.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { FavoriteService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('favorites')
export class FavoriteController {
  constructor(private readonly service: FavoriteService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async add(@Body() dto: any, @Request() req) {
    const user = req.user;
    const payload = {
      ...dto,
      userId: user.userId,
    };
    const data = await this.service.addFavorite(payload);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-user')
  async getByUser(@Request() req) {
    const userId = req.user?.userId;
    const data = await this.service.getFavoritesByUser(userId);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.service.removeFavorite(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.DELETE);
  }
}
