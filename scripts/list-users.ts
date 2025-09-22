import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (users.length === 0) {
      console.log('No users found in the database.');
      return;
    }

    console.log('Users in the database:');
    console.log('====================');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.createdAt.toLocaleDateString()}`);
      console.log('');
    });
  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
