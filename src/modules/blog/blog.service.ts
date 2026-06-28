import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { BlogPost } from "@prisma/client";
import { CreateBlogPostDto, UpdateBlogPostDto } from "./dto/blog.dto";

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(limit = 10, status = "PUBLISHED"): Promise<BlogPost[]> {
    return this.prisma.blogPost.findMany({
      where: { status },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: limit,
    });
  }

  async findBySlug(slug: string): Promise<BlogPost> {
    const post = await this.prisma.blogPost.findFirst({
      where: { slug, status: "PUBLISHED" },
    });
    if (!post) throw new NotFoundException("Blog post not found");
    return post;
  }

  async findById(id: string): Promise<BlogPost> {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException("Blog post not found");
    return post;
  }

  async create(dto: CreateBlogPostDto): Promise<BlogPost> {
    return this.prisma.blogPost.create({
      data: {
        ...dto,
        publishedAt: dto.status === "PUBLISHED" ? new Date() : null,
      } as any,
    });
  }

  async update(id: string, dto: UpdateBlogPostDto): Promise<BlogPost> {
    const post = await this.findById(id);
    const data: any = { ...dto };
    if (dto.status === "PUBLISHED" && post.status !== "PUBLISHED") {
      data.publishedAt = new Date();
    }
    return this.prisma.blogPost.update({ where: { id }, data });
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.blogPost.delete({ where: { id } });
  }
}
