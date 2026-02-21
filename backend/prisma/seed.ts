import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Create Permissions
  const p1 = await prisma.permission.upsert({
    where: { name: 'blog:create' },
    update: {},
    create: { name: 'blog:create', description: 'Can create blogs' },
  });

  const p2 = await prisma.permission.upsert({
    where: { name: 'blog:publish' },
    update: {},
    create: { name: 'blog:publish', description: 'Can publish blogs' },
  });

  // 2. Create Admin Role
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {
      permissions: {
        connect: [{ id: p1.id }, { id: p2.id }],
      },
    },
    create: {
      name: 'ADMIN',
      description: 'Administrator role',
      permissions: {
        connect: [{ id: p1.id }, { id: p2.id }],
      },
    },
  });

  // 3. Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      fullName: 'System Admin',
      roleId: adminRole.id,
    },
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
