import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { createResponse } from 'src/common/helpers/response.helper';
import { CreatePromotionDto } from './dtos/create.dto';
import { PromotionService } from './promotion.service';

@Controller('promotions')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post('')
  async create(@Body() dto: CreatePromotionDto) {
    const data = await this.promotionService.create(dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get('')
  async getAllPromotion() {
    const data = await this.promotionService.getAll();
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }
  @Get('active-or-default')
  async getActiveOrDefaultPromotions() {
    const data = await this.promotionService.getActiveOrDefaultPromotions();
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get(':id')
  async getPromotionById(@Param('id') id: string) {
    const data = await this.promotionService.getPromotionById(id);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }
}
