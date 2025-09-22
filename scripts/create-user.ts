import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createUser(email: string, name: string, role: 'STUDENT' | 'TEACHER' | 'ADMIN' = 'STUDENT') {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`User with email ${email} already exists`);
      return;
    }

    // Create the user (no password needed for OAuth-based auth)
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role,
        emailVerified: new Date(), // Mark as verified for testing
      },
    });

    console.log(`Successfully created user: ${user.name} (${user.email})`);
    console.log(`Role: ${user.role}`);
    console.log(`ID: ${user.id}`);
    console.log('');
    console.log('Note: This user will need to sign in with OAuth (GitHub, Google, etc.)');
    console.log('The password field is not used in this OAuth-based system.');
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get arguments from command line
const email = process.argv[2];
const name = process.argv[3];
const role = (process.argv[4] as 'STUDENT' | 'TEACHER' | 'ADMIN') || 'STUDENT';

if (!email || !name) {
  console.log('Usage: tsx scripts/create-user.ts <email> <name> [role]');
  console.log('Example: tsx scripts/create-user.ts user@example.com "John Doe" ADMIN');
  console.log('Roles: STUDENT, TEACHER, ADMIN (default: STUDENT)');
  console.log('');
  console.log('Note: This creates a user for OAuth authentication (GitHub, Google, etc.)');
  console.log('The user will need to sign in with their OAuth provider.');
  process.exit(1);
}

createUser(email, name, role);
