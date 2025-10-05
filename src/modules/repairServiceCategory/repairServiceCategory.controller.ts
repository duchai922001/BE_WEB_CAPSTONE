import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { RepairServiceCategoryService } from './repairServiceCategory.service';
import {
  CreateRepairServiceCategoryDto,
  UpdateRepairServiceCategoryDto,
} from './repairServiceCategory.dto';

@Controller('repair-service-categories')
export class RepairServiceCategoryController {
  constructor(private readonly categoryService: RepairServiceCategoryService) {}

  @Post()
  create(@Body() dto: CreateRepairServiceCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRepairServiceCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
