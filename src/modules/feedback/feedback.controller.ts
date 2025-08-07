import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dtos/create.feedback';
import { UpdateFeedbackDto } from './dtos/update.feedback';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';

@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  async create(@Body() dto: CreateFeedbackDto) {
    const data = await this.feedbackService.create(dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get()
  async findAll() {
    const data = await this.feedbackService.findAll();
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get('product/:productId')
  async getFeedbackByProduct(@Param('productId') productId: string) {
    const data = await this.feedbackService.getFeedbackByProduct(productId);
    return createResponse(HttpStatus.OK, data, ResponseMessage.GET);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const data = await this.feedbackService.findById(id);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.GET);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFeedbackDto) {
    const data = await this.feedbackService.update(id, dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.UPDATE);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const data = await this.feedbackService.delete(id);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.DELETE);
  }
}
