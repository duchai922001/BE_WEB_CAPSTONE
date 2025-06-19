import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './blog.entity';
import { CreateBlogDto } from './dtos/create.dto';
import { BaseQueryDto } from 'src/common/dtos/base-query.dto';
import { builderQuery } from 'src/common/helpers/query-builder.helper';

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

  async GetAllQuery(query: BaseQueryDto) {
    const { filter, pagination, sort, select, populate } = builderQuery(query);

    let mongoQuery = this.blogModel.find(filter).sort(sort);

    for (const pop of populate) {
      mongoQuery = mongoQuery.populate(pop);
    }

    const [data, total] = await Promise.all([
      mongoQuery.skip(pagination.skip).limit(pagination.limit).exec(),
      this.blogModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
    };
  }
}
