import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './blog.entity';
import { CreateBlogDto } from './dtos/create.dto';

@Injectable()
export class BlogRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
  ) {}

  async createBlog(dto: CreateBlogDto): Promise<Blog> {
    const createdBlog = new this.blogModel(dto);
    return createdBlog.save();
  }

  async updateBlog(
    id: string,
    dto: Partial<CreateBlogDto>,
  ): Promise<Blog | null> {
    return this.blogModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async deleteBlog(id: string): Promise<Blog | null> {
    return this.blogModel.findByIdAndDelete(id);
  }

  async findById(id: string): Promise<Blog | null> {
    return this.blogModel.findById(id);
  }

  async findAll(): Promise<Blog[]> {
    return this.blogModel.find();
  }
}
