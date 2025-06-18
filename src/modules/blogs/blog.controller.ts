import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dtos/create.dto';
import { createResponse } from 'src/common/helpers/response.helper';
import { ResponseMessage } from 'src/common/enums/responseMessage';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  async create(@Body() dto: CreateBlogDto) {
    const blog = await this.blogService.createBlog(dto);
    return createResponse(HttpStatus.CREATED, blog, ResponseMessage.CREATE);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateBlogDto>) {
    const updated = await this.blogService.updateBlog(id, dto);
    return createResponse(HttpStatus.OK, updated, ResponseMessage.UPDATE);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.blogService.deleteBlog(id);
    return createResponse(HttpStatus.OK, null, ResponseMessage.DELETE);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const blog = await this.blogService.findBlogById(id);
    return createResponse(HttpStatus.OK, blog, ResponseMessage.GET);
  }

  @Get()
  async getAll(@Query() query: BaseQueryDto) {
    const blogs = await this.blogService.getBlogsQuery(query);
    return createResponse(HttpStatus.OK, blogs, ResponseMessage.GET);
  }
}
