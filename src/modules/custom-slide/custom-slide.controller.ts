import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CustomSlideService } from './custom-slide.service';
import { CreateCustomSlideDto, UpdateCustomSlideDto } from './custom-slide.dto';

@Controller('custom-slides')
export class CustomSlideController {
  constructor(private readonly customSlideService: CustomSlideService) {}

  @Post()
  create(@Body() dto: CreateCustomSlideDto) {
    return this.customSlideService.create(dto);
  }

  @Get()
  findAll() {
    return this.customSlideService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customSlideService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCustomSlideDto) {
    return this.customSlideService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customSlideService.remove(id);
  }
}
