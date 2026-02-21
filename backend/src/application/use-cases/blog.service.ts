import { Injectable, Inject } from '@nestjs/common';
import { IBlogRepository, BLOG_REPOSITORY } from 'src/domain/repositories/blog.repository.interface';
import { Blog } from 'src/domain/entities/blog.entity';

@Injectable()
export class BlogService {
  constructor(@Inject(BLOG_REPOSITORY) private blogRepository: IBlogRepository) {}

  async getAllBlogs() {
    return this.blogRepository.findAll(true);
  }

  async getBlogBySlug(slug: string) {
    return this.blogRepository.findBySlug(slug);
  }

  async createBlog(data: any) {
    // Basic slug generation logic
    const slug = data.title.toLowerCase().replace(/ /g, '-');
    return this.blogRepository.create({ ...data, slug });
  }

  async updateBlog(id: string, data: any) {
    return this.blogRepository.update(id, data);
  }

  async deleteBlog(id: string) {
    return this.blogRepository.delete(id);
  }
}
