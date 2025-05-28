import { Controller, Post, Get, Param, Body, HttpStatus } from '@nestjs/common';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { HashTagService } from './hashtag.service';
import { CreateHashTagDto } from './dtos/create.dto';

@Controller('hashtags')
export class HashTagController {
  constructor(private readonly hashtagService: HashTagService) {}

  @Post()
  async create(@Body() dto: CreateHashTagDto) {
    const data = await this.hashtagService.create(dto);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.CREATE);
  }

  @Get()
  async findAll() {
    const data = await this.hashtagService.findAll();
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.GET);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const data = await this.hashtagService.findById(id);
    return createResponse(HttpStatus.CREATED, data, ResponseMessage.GET);
  }
}
