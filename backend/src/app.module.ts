import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule } from './auth.module';
import { UserPersistenceModule } from './infrastructure/prisma/user-persistence.module';
import { BlogController } from './presentation/controllers/blog.controller';
import { AuthController } from './presentation/controllers/auth.controller';
import { BlogService } from './application/use-cases/blog.service';
import { BLOG_REPOSITORY } from './domain/repositories/blog.repository.interface';
import { BlogRepository } from './infrastructure/prisma/blog.repository';
import { PortfolioController } from './presentation/controllers/portfolio.controller';
import { PortfolioService } from './application/use-cases/portfolio.service';

@Module({
  imports: [PrismaModule, AuthModule, UserPersistenceModule],
  controllers: [AppController, AuthController, BlogController, PortfolioController],
  providers: [
    AppService,
    BlogService,
    PortfolioService,
    {
      provide: BLOG_REPOSITORY,
      useClass: BlogRepository,
    },
  ],
})
export class AppModule {}
