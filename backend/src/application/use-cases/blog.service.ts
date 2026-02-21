import { Injectable, Inject } from '@nestjs/common';
import type { IBlogRepository } from 'src/domain/repositories/blog.repository.interface';
import { BLOG_REPOSITORY } from 'src/domain/repositories/blog.repository.interface';
import type { CreateBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { Blog } from 'src/domain/entities/blog.entity';

@Injectable()
export class BlogService {
  constructor(
    @Inject(BLOG_REPOSITORY) private blogRepository: IBlogRepository,
  ) {}

  async getAllBlogs(locale: string = 'en'): Promise<Blog[]> {
    return this.blogRepository.findAll(true); 
  }

  async getBlogBySlug(slug: string, locale: string = 'en'): Promise<Blog | null> {
    return this.blogRepository.findBySlug(slug);
  }

  async createBlog(data: CreateBlogDto): Promise<Blog> {
    const slug = data.title.toLowerCase().trim().replace(/\s+/g, '-');
    return this.blogRepository.create({ ...data, slug });
  }

  async updateBlog(id: string, data: UpdateBlogDto): Promise<Blog> {
    return this.blogRepository.update(id, data);
  }

  async deleteBlog(id: string): Promise<void> {
    return this.blogRepository.delete(id);
  }
}
