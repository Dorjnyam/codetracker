import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function promoteToAdmin(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`User with email ${email} not found`);
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });

    console.log(`Successfully promoted ${updatedUser.name} (${updatedUser.email}) to ADMIN`);
  } catch (error) {
    console.error('Error promoting user to admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: tsx scripts/promote-to-admin.ts <email>');
  console.log('Example: tsx scripts/promote-to-admin.ts user@example.com');
  process.exit(1);
}

promoteToAdmin(email);
