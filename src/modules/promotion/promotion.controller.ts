import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { createResponse } from 'src/common/helpers/response.helper';
import { CreatePromotionDto } from './dtos/create.dto';
import { UpdatePromotionDto } from './dtos/update.dto';
import { PromotionService } from './promotion.service';

@Controller('promotions')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post()
  async create(@Body() dto: CreatePromotionDto) {
    const promotion = await this.promotionService.create(dto);
    return createResponse(
      HttpStatus.CREATED,
      promotion,
      ResponseMessage.CREATE,
    );
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePromotionDto) {
    const updated = await this.promotionService.update(id, dto);
    return createResponse(HttpStatus.OK, updated, ResponseMessage.UPDATE);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.promotionService.softDelete(id);
    return createResponse(HttpStatus.OK, null, ResponseMessage.DELETE);
  }

  @Get()
  async getAll() {
    const promotions = await this.promotionService.findAll();
    return createResponse(HttpStatus.OK, promotions, ResponseMessage.GET);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const promotion = await this.promotionService.findById(id);
    return createResponse(HttpStatus.OK, promotion, ResponseMessage.GET);
  }
}
