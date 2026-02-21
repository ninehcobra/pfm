export class Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail?: string;
  published: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}
