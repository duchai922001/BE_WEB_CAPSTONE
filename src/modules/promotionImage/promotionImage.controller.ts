import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { PromotionImageService } from './promotionImage.service';
import { CreatePromotionImageDto } from './dtos/create.dto';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';

@Controller('promotionImage')
export class PromotionImageController {
  constructor(private readonly promotionImageService: PromotionImageService) {}

  @Post('')
  async createPromotionImage(@Body() dto: CreatePromotionImageDto) {
    const data = await this.promotionImageService.create(dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get('')
  async getAllPromotionImages() {
    const data = await this.promotionImageService.getAllPromotionImages();
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get(':id')
  async getPromotionImageById(@Param('id') id: string) {
    const data = await this.promotionImageService.getPromotionImageById(id);
    if (!data) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        ResponseMessage.FILE_NOT_FOUND,
      );
    }
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Delete(':id')
  async deletePromotionImage(@Param('id') id: string) {
    const data = await this.promotionImageService.delete(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.DELETE);
  }
}
