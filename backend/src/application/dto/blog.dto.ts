export interface CreateBlogDto {
  title: string;
  content: string;
  thumbnail?: string;
  published?: boolean;
  authorId: string;
}

export interface UpdateBlogDto {
  title?: string;
  content?: string;
  thumbnail?: string;
  published?: boolean;
}
