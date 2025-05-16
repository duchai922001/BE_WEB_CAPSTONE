import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpStatus,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dtos/create.dto';
import { createResponse } from 'src/common/helpers/response.helper';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  async create(@Body() dto: CreateBlogDto) {
    const blog = await this.blogService.createBlog(dto);
    return createResponse(HttpStatus.CREATED, blog, 'Tạo blog thành công');
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateBlogDto>) {
    const updated = await this.blogService.updateBlog(id, dto);
    return createResponse(HttpStatus.OK, updated, 'Cập nhật blog thành công');
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.blogService.deleteBlog(id);
    return createResponse(HttpStatus.OK, null, 'Xoá blog thành công');
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const blog = await this.blogService.findBlogById(id);
    return createResponse(HttpStatus.OK, blog, 'Lấy blog thành công');
  }
}
