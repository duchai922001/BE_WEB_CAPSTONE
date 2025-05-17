import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TypeBlog } from '../blog.entity';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  thumbailImage: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  brieftContent: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  hashTag?: string;

  @IsEnum(TypeBlog)
  @IsNotEmpty()
  typeBlog: TypeBlog;
}
