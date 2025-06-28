import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogRepository } from './blog.repository';
import { CreateBlogDto } from './dtos/create.dto';
import { Blog } from './blog.entity';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';

@Injectable()
export class BlogService {
  constructor(private readonly blogRepository: BlogRepository) {}

  async createBlog(dto: CreateBlogDto, userId: string): Promise<Blog> {
    const payload = {
      ...dto,
      userId,
    };
    return this.blogRepository.createBlog(payload);
  }

  async updateBlog(id: string, dto: Partial<CreateBlogDto>): Promise<Blog> {
    const updatedBlog = await this.blogRepository.updateBlog(id, dto);
    if (!updatedBlog) {
      throw new NotFoundException(`Không tìm thấy blog với id: ${id}`);
    }
    return updatedBlog;
  }

  async deleteBlog(id: string): Promise<Blog> {
    const deleted = await this.blogRepository.deleteBlog(id);
    if (!deleted) {
      throw new NotFoundException(`Không tìm thấy blog với id: ${id}`);
    }
    return deleted;
  }

  async findBlogById(id: string): Promise<Blog> {
    const blog = await this.blogRepository.findById(id);
    if (!blog) {
      throw new NotFoundException(`Không tìm thấy blog với id: ${id}`);
    }
    return blog;
  }

  async findAllBlogs(): Promise<Blog[]> {
    return this.blogRepository.findAll();
  }

  async getBlogsQuery(query: BaseQueryDto) {
    return this.blogRepository.GetAllQuery(query);
  }
}
