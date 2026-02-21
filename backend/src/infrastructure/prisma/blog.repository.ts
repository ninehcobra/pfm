import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IBlogRepository } from 'src/domain/repositories/blog.repository.interface';
import { Blog } from 'src/domain/entities/blog.entity';

@Injectable()
export class BlogRepository implements IBlogRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Partial<Blog>): Promise<Blog> {
    return this.prisma.blog.create({
      data: {
        title: data.title!,
        slug: data.slug!,
        content: data.content!,
        authorId: data.authorId!,
        thumbnail: data.thumbnail,
        published: data.published ?? false,
      },
    }) as unknown as Blog;
  }

  async findAll(publishedOnly?: boolean): Promise<Blog[]> {
    return this.prisma.blog.findMany({
      where: publishedOnly ? { published: true } : {},
      include: { author: true },
    }) as unknown as Blog[];
  }

  async findById(id: string): Promise<Blog | null> {
    return this.prisma.blog.findUnique({
      where: { id },
    }) as unknown as Blog | null;
  }

  async findBySlug(slug: string): Promise<Blog | null> {
    return this.prisma.blog.findUnique({
      where: { slug },
    }) as unknown as Blog | null;
  }

  async update(id: string, data: Partial<Blog>): Promise<Blog> {
    return this.prisma.blog.update({
      where: { id },
      data,
    }) as unknown as Blog;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.blog.delete({ where: { id } });
  }
}
