import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CustomBannerService } from './custom-banner.service';
import { CustomBanner } from './custom-banner.schema';
import {
  CreateCustomBannerDto,
  UpdateCustomBannerDto,
} from './custom-banner.dto';

@Controller('custom-banners')
export class CustomBannerController {
  constructor(private readonly bannerService: CustomBannerService) {}

  @Get()
  async getAll(): Promise<CustomBanner[]> {
    return this.bannerService.findAll();
  }

  @Post()
  async create(@Body() payload: CreateCustomBannerDto) {
    return this.bannerService.create(payload);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateCustomBannerDto,
  ) {
    return this.bannerService.update(id, payload);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.bannerService.delete(id);
  }
}
