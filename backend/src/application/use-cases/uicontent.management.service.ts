import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class UIContentManagementService {
  constructor(private prisma: PrismaService) {}

  async getAllContent() {
    return this.prisma.uIContent.findMany({
      include: { language: true },
      orderBy: { key: 'asc' }
    });
  }

  async updateContent(data: { key: string; languageId: string; value: string }[]) {
    for (const item of data) {
      await this.prisma.uIContent.upsert({
        where: { key_languageId: { key: item.key, languageId: item.languageId } },
        update: { value: item.value },
        create: { key: item.key, languageId: item.languageId, value: item.value }
      });
    }
    return { success: true };
  }
}
