import { PrismaClient, Role, Difficulty, ClassMemberRole, ActivityType, NotificationType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@codetracker.com' },
    update: {},
    create: {
      email: 'admin@codetracker.com',
      name: 'Admin User',
      username: 'admin',
      role: Role.ADMIN,
      totalXP: 1000,
      level: 10,
      streak: 30,
      preferredLanguages: ['JavaScript', 'Python', 'TypeScript'],
      institution: 'CodeTracker University',
      bio: 'System administrator for CodeTracker platform',
    },
  });

  // Create teacher users
  const teacherPassword = await bcrypt.hash('teacher123', 12);
  const teacher1 = await prisma.user.upsert({
    where: { email: 'teacher1@codetracker.com' },
    update: {},
    create: {
      email: 'teacher1@codetracker.com',
      name: 'Dr. Sarah Johnson',
      username: 'sarah_j',
      role: Role.TEACHER,
      totalXP: 2500,
      level: 15,
      streak: 45,
      preferredLanguages: ['Python', 'Java', 'C++'],
      institution: 'Tech University',
      bio: 'Computer Science Professor specializing in algorithms and data structures',
    },
  });

  const teacher2 = await prisma.user.upsert({
    where: { email: 'teacher2@codetracker.com' },
    update: {},
    create: {
      email: 'teacher2@codetracker.com',
      name: 'Prof. Michael Chen',
      username: 'michael_c',
      role: Role.TEACHER,
      totalXP: 1800,
      level: 12,
      streak: 25,
      preferredLanguages: ['JavaScript', 'TypeScript', 'React'],
      institution: 'Tech University',
      bio: 'Full-stack development instructor with 10+ years industry experience',
    },
  });

  // Create student users
  const studentPassword = await bcrypt.hash('student123', 12);
  const students = await Promise.all([
    prisma.user.upsert({
      where: { email: 'student1@codetracker.com' },
      update: {},
      create: {
        email: 'student1@codetracker.com',
        name: 'Alice Smith',
        username: 'alice_s',
        role: Role.STUDENT,
        totalXP: 450,
        level: 3,
        streak: 7,
        preferredLanguages: ['Python', 'JavaScript'],
        institution: 'Tech University',
        bio: 'Computer Science student passionate about web development',
      },
    }),
    prisma.user.upsert({
      where: { email: 'student2@codetracker.com' },
      update: {},
      create: {
        email: 'student2@codetracker.com',
        name: 'Bob Wilson',
        username: 'bob_w',
        role: Role.STUDENT,
        totalXP: 320,
        level: 2,
        streak: 3,
        preferredLanguages: ['Java', 'Python'],
        institution: 'Tech University',
        bio: 'Software engineering student interested in mobile development',
      },
    }),
    prisma.user.upsert({
      where: { email: 'student3@codetracker.com' },
      update: {},
      create: {
        email: 'student3@codetracker.com',
        name: 'Carol Davis',
        username: 'carol_d',
        role: Role.STUDENT,
        totalXP: 680,
        level: 4,
        streak: 12,
        preferredLanguages: ['JavaScript', 'TypeScript', 'React'],
        institution: 'Tech University',
        bio: 'Frontend development enthusiast and open source contributor',
      },
    }),
    prisma.user.upsert({
      where: { email: 'student4@codetracker.com' },
      update: {},
      create: {
        email: 'student4@codetracker.com',
        name: 'David Brown',
        username: 'david_b',
        role: Role.STUDENT,
        totalXP: 890,
        level: 5,
        streak: 18,
        preferredLanguages: ['Python', 'C++', 'JavaScript'],
        institution: 'Tech University',
        bio: 'Competitive programmer and algorithm enthusiast',
      },
    }),
    prisma.user.upsert({
      where: { email: 'student5@codetracker.com' },
      update: {},
      create: {
        email: 'student5@codetracker.com',
        name: 'Emma Taylor',
        username: 'emma_t',
        role: Role.STUDENT,
        totalXP: 1200,
        level: 6,
        streak: 22,
        preferredLanguages: ['Python', 'Java', 'JavaScript'],
        institution: 'Tech University',
        bio: 'Full-stack developer in training with focus on AI/ML',
      },
    }),
  ]);

  console.log('✅ Users created successfully');

  // Create classes
  const class1 = await prisma.class.create({
    data: {
      name: 'CS101 - Introduction to Programming',
      description: 'Learn the fundamentals of programming with Python and JavaScript',
      ownerId: teacher1.id,
      inviteCode: 'CS101-FALL2024',
      semester: 'Fall 2024',
      isActive: true,
      settings: {
        allowLateSubmissions: true,
        maxLateDays: 3,
        gradingPolicy: 'points',
      },
    },
  });

  const class2 = await prisma.class.create({
    data: {
      name: 'CS201 - Data Structures and Algorithms',
      description: 'Advanced programming concepts and algorithm design',
      ownerId: teacher1.id,
      inviteCode: 'CS201-FALL2024',
      semester: 'Fall 2024',
      isActive: true,
      settings: {
        allowLateSubmissions: false,
        collaborationEnabled: true,
        gradingPolicy: 'weighted',
      },
    },
  });

  const class3 = await prisma.class.create({
    data: {
      name: 'WEB301 - Full-Stack Development',
      description: 'Modern web development with React, Node.js, and databases',
      ownerId: teacher2.id,
      inviteCode: 'WEB301-FALL2024',
      semester: 'Fall 2024',
      isActive: true,
      settings: {
        allowLateSubmissions: true,
        maxLateDays: 2,
        collaborationEnabled: true,
        gradingPolicy: 'points',
      },
    },
  });

  console.log('✅ Classes created successfully');

  // Add students to classes
  await Promise.all([
    // CS101 students
    prisma.classMember.createMany({
      data: [
        { classId: class1.id, userId: students[0].id, role: ClassMemberRole.STUDENT },
        { classId: class1.id, userId: students[1].id, role: ClassMemberRole.STUDENT },
        { classId: class1.id, userId: students[2].id, role: ClassMemberRole.STUDENT },
      ],
    }),
    // CS201 students
    prisma.classMember.createMany({
      data: [
        { classId: class2.id, userId: students[2].id, role: ClassMemberRole.STUDENT },
        { classId: class2.id, userId: students[3].id, role: ClassMemberRole.STUDENT },
        { classId: class2.id, userId: students[4].id, role: ClassMemberRole.STUDENT },
      ],
    }),
    // WEB301 students
    prisma.classMember.createMany({
      data: [
        { classId: class3.id, userId: students[0].id, role: ClassMemberRole.STUDENT },
        { classId: class3.id, userId: students[2].id, role: ClassMemberRole.STUDENT },
        { classId: class3.id, userId: students[4].id, role: ClassMemberRole.STUDENT },
      ],
    }),
  ]);

  console.log('✅ Class memberships created successfully');

  // Create assignments
  const assignment1 = await prisma.assignment.create({
    data: {
      title: 'Hello World Program',
      description: 'Create your first Python program that prints "Hello, World!"',
      classId: class1.id,
      creatorId: teacher1.id,
      difficulty: Difficulty.EASY,
      language: 'Python',
      maxScore: 100,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      isActive: true,
      testCases: [
        {
          input: '',
          expectedOutput: 'Hello, World!',
          isHidden: false,
          description: 'Basic hello world test',
        },
      ],
      starterCode: '# Write your code here\nprint("Hello, World!")',
      instructions: 'Write a Python program that prints "Hello, World!" to the console.',
      allowLateSubmission: true,
      maxAttempts: 5,
      timeLimit: 30,
    },
  });

  const assignment2 = await prisma.assignment.create({
    data: {
      title: 'FizzBuzz Challenge',
      description: 'Implement the classic FizzBuzz algorithm',
      classId: class1.id,
      creatorId: teacher1.id,
      difficulty: Difficulty.MEDIUM,
      language: 'Python',
      maxScore: 100,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      isActive: true,
      testCases: [
        {
          input: '15',
          expectedOutput: 'FizzBuzz',
          isHidden: false,
          description: 'Number divisible by both 3 and 5',
        },
        {
          input: '9',
          expectedOutput: 'Fizz',
          isHidden: false,
          description: 'Number divisible by 3',
        },
        {
          input: '10',
          expectedOutput: 'Buzz',
          isHidden: false,
          description: 'Number divisible by 5',
        },
        {
          input: '7',
          expectedOutput: '7',
          isHidden: true,
          description: 'Number not divisible by 3 or 5',
        },
      ],
      starterCode: 'def fizzbuzz(n):\n    # Your implementation here\n    pass',
      instructions: 'Implement a function that returns "Fizz" for numbers divisible by 3, "Buzz" for numbers divisible by 5, "FizzBuzz" for numbers divisible by both, and the number itself otherwise.',
      allowLateSubmission: true,
      maxAttempts: 3,
      timeLimit: 60,
    },
  });

  const assignment3 = await prisma.assignment.create({
    data: {
      title: 'Binary Search Implementation',
      description: 'Implement binary search algorithm with proper error handling',
      classId: class2.id,
      creatorId: teacher1.id,
      difficulty: Difficulty.HARD,
      language: 'Python',
      maxScore: 100,
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
      isActive: true,
      testCases: [
        {
          input: '[1, 2, 3, 4, 5], 3',
          expectedOutput: '2',
          isHidden: false,
          description: 'Element found in middle',
        },
        {
          input: '[1, 2, 3, 4, 5], 6',
          expectedOutput: '-1',
          isHidden: false,
          description: 'Element not found',
        },
        {
          input: '[], 1',
          expectedOutput: '-1',
          isHidden: true,
          description: 'Empty array',
        },
      ],
      starterCode: 'def binary_search(arr, target):\n    # Your implementation here\n    pass',
      instructions: 'Implement binary search that returns the index of the target element, or -1 if not found. Handle edge cases like empty arrays.',
      allowLateSubmission: false,
      maxAttempts: 2,
      timeLimit: 90,
    },
  });

  const assignment4 = await prisma.assignment.create({
    data: {
      title: 'React Todo App',
      description: 'Build a complete todo application with React',
      classId: class3.id,
      creatorId: teacher2.id,
      difficulty: Difficulty.MEDIUM,
      language: 'JavaScript',
      maxScore: 150,
      dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 days from now
      isActive: true,
      testCases: [
        {
          input: 'Add todo "Learn React"',
          expectedOutput: 'Todo added successfully',
          isHidden: false,
          description: 'Add new todo item',
        },
        {
          input: 'Complete todo 1',
          expectedOutput: 'Todo marked as complete',
          isHidden: false,
          description: 'Mark todo as complete',
        },
        {
          input: 'Delete todo 1',
          expectedOutput: 'Todo deleted successfully',
          isHidden: true,
          description: 'Delete todo item',
        },
      ],
      starterCode: '// React component starter code\nimport React, { useState } from \'react\';\n\nconst TodoApp = () => {\n  // Your implementation here\n  return (\n    <div>\n      {/* Todo app UI */}\n    </div>\n  );\n};\n\nexport default TodoApp;',
      instructions: 'Create a React todo application with the following features: add todos, mark as complete, delete todos, and filter by status.',
      allowLateSubmission: true,
      maxAttempts: 3,
      timeLimit: 120,
    },
  });

  console.log('✅ Assignments created successfully');

  // Create sample submissions
  await prisma.submission.createMany({
    data: [
      {
        assignmentId: assignment1.id,
        studentId: students[0].id,
        code: 'print("Hello, World!")',
        language: 'Python',
        status: 'PASSED',
        score: 100,
        maxScore: 100,
        testResults: {
          passed: 1,
          total: 1,
          details: [{ test: 'Basic hello world test', passed: true }],
        },
        feedback: 'Excellent work! Perfect implementation.',
        executionTime: 15.5,
        memoryUsage: 2.1,
        attemptNumber: 1,
        isLate: false,
        gradedAt: new Date(),
      },
      {
        assignmentId: assignment1.id,
        studentId: students[1].id,
        code: 'print("Hello World")',
        language: 'Python',
        status: 'FAILED',
        score: 0,
        maxScore: 100,
        testResults: {
          passed: 0,
          total: 1,
          details: [{ test: 'Basic hello world test', passed: false, expected: 'Hello, World!', actual: 'Hello World' }],
        },
        feedback: 'Almost correct! Remember the comma and exclamation mark.',
        executionTime: 12.3,
        memoryUsage: 1.8,
        attemptNumber: 1,
        isLate: false,
        gradedAt: new Date(),
      },
      {
        assignmentId: assignment2.id,
        studentId: students[2].id,
        code: `def fizzbuzz(n):
    if n % 15 == 0:
        return "FizzBuzz"
    elif n % 3 == 0:
        return "Fizz"
    elif n % 5 == 0:
        return "Buzz"
    else:
        return str(n)`,
        language: 'Python',
        status: 'PASSED',
        score: 100,
        maxScore: 100,
        testResults: {
          passed: 4,
          total: 4,
          details: [
            { test: 'Number divisible by both 3 and 5', passed: true },
            { test: 'Number divisible by 3', passed: true },
            { test: 'Number divisible by 5', passed: true },
            { test: 'Number not divisible by 3 or 5', passed: true },
          ],
        },
        feedback: 'Perfect implementation! Great job handling all edge cases.',
        executionTime: 8.7,
        memoryUsage: 1.5,
        attemptNumber: 1,
        isLate: false,
        gradedAt: new Date(),
      },
    ],
  });

  console.log('✅ Submissions created successfully');

  // Create achievements
  const achievements = await Promise.all([
    prisma.achievement.create({
      data: {
        name: 'First Steps',
        description: 'Complete your first assignment',
        icon: '🎯',
        category: 'milestone',
        xpReward: 50,
        requirement: { type: 'submissions', count: 1 },
        isActive: true,
      },
    }),
    prisma.achievement.create({
      data: {
        name: 'Code Warrior',
        description: 'Complete 10 assignments',
        icon: '⚔️',
        category: 'milestone',
        xpReward: 200,
        requirement: { type: 'submissions', count: 10 },
        isActive: true,
      },
    }),
    prisma.achievement.create({
      data: {
        name: 'Streak Master',
        description: 'Maintain a 7-day coding streak',
        icon: '🔥',
        category: 'streak',
        xpReward: 100,
        requirement: { type: 'streak', days: 7 },
        isActive: true,
      },
    }),
    prisma.achievement.create({
      data: {
        name: 'Python Pro',
        description: 'Master Python programming',
        icon: '🐍',
        category: 'language',
        xpReward: 150,
        requirement: { type: 'language_mastery', language: 'Python', score: 1000 },
        isActive: true,
      },
    }),
    prisma.achievement.create({
      data: {
        name: 'Perfect Score',
        description: 'Get 100% on an assignment',
        icon: '💯',
        category: 'performance',
        xpReward: 75,
        requirement: { type: 'perfect_score', count: 1 },
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Achievements created successfully');

  // Award achievements to users
  await prisma.userAchievement.createMany({
    data: [
      { userId: students[0].id, achievementId: achievements[0].id },
      { userId: students[0].id, achievementId: achievements[4].id },
      { userId: students[2].id, achievementId: achievements[0].id },
      { userId: students[2].id, achievementId: achievements[4].id },
      { userId: students[4].id, achievementId: achievements[0].id },
      { userId: students[4].id, achievementId: achievements[2].id },
    ],
  });

  console.log('✅ User achievements awarded successfully');

  // Create sample activities
  await prisma.activity.createMany({
    data: [
      {
        userId: students[0].id,
        type: ActivityType.SUBMISSION_CREATED,
        description: 'Submitted Hello World Program',
        metadata: { assignmentId: assignment1.id, score: 100 },
        xpEarned: 50,
      },
      {
        userId: students[0].id,
        type: ActivityType.ACHIEVEMENT_UNLOCKED,
        description: 'Unlocked achievement: First Steps',
        metadata: { achievementId: achievements[0].id },
        xpEarned: 50,
      },
      {
        userId: students[2].id,
        type: ActivityType.SUBMISSION_CREATED,
        description: 'Submitted FizzBuzz Challenge',
        metadata: { assignmentId: assignment2.id, score: 100 },
        xpEarned: 50,
      },
      {
        userId: students[2].id,
        type: ActivityType.ACHIEVEMENT_UNLOCKED,
        description: 'Unlocked achievement: Perfect Score',
        metadata: { achievementId: achievements[4].id },
        xpEarned: 75,
      },
    ],
  });

  console.log('✅ Activities created successfully');

  // Create sample notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: students[1].id,
        title: 'Assignment Graded',
        message: 'Your Hello World Program has been graded. Score: 0/100',
        type: NotificationType.SUBMISSION_GRADED,
        metadata: { assignmentId: assignment1.id, score: 0 },
        isRead: false,
      },
      {
        userId: students[2].id,
        title: 'Achievement Unlocked!',
        message: 'Congratulations! You unlocked the "Perfect Score" achievement.',
        type: NotificationType.ACHIEVEMENT_UNLOCKED,
        metadata: { achievementId: achievements[4].id },
        isRead: true,
      },
      {
        userId: students[0].id,
        title: 'New Assignment Available',
        message: 'FizzBuzz Challenge is now available in CS101',
        type: NotificationType.ASSIGNMENT_DUE,
        metadata: { assignmentId: assignment2.id },
        isRead: false,
      },
    ],
  });

  console.log('✅ Notifications created successfully');

  // Create sample forum posts
  const forumPost1 = await prisma.forumPost.create({
    data: {
      title: 'Welcome to CS101!',
      content: 'Welcome everyone to Introduction to Programming! Feel free to ask questions and help each other out.',
      classId: class1.id,
      authorId: teacher1.id,
      isPinned: true,
      tags: ['welcome', 'introduction'],
    },
  });

  const forumPost2 = await prisma.forumPost.create({
    data: {
      title: 'Question about Hello World assignment',
      content: 'I\'m having trouble with the Hello World program. Can someone help me understand the syntax?',
      classId: class1.id,
      authorId: students[1].id,
      tags: ['help', 'python', 'syntax'],
    },
  });

  // Create forum comments
  await prisma.forumComment.createMany({
    data: [
      {
        content: 'Welcome to the class! Looking forward to learning with everyone.',
        postId: forumPost1.id,
        authorId: students[0].id,
      },
      {
        content: 'Sure! The basic syntax is: print("Hello, World!") - make sure to include the comma and exclamation mark.',
        postId: forumPost2.id,
        authorId: students[0].id,
      },
      {
        content: 'Thanks for the help! That makes sense now.',
        postId: forumPost2.id,
        authorId: students[1].id,
      },
    ],
  });

  console.log('✅ Forum posts and comments created successfully');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Users: ${await prisma.user.count()}`);
  console.log(`- Classes: ${await prisma.class.count()}`);
  console.log(`- Assignments: ${await prisma.assignment.count()}`);
  console.log(`- Submissions: ${await prisma.submission.count()}`);
  console.log(`- Achievements: ${await prisma.achievement.count()}`);
  console.log(`- Activities: ${await prisma.activity.count()}`);
  console.log(`- Notifications: ${await prisma.notification.count()}`);
  console.log(`- Forum Posts: ${await prisma.forumPost.count()}`);
  
  console.log('\n🔑 Test Accounts:');
  console.log('Admin: admin@codetracker.com / admin123');
  console.log('Teacher: teacher1@codetracker.com / teacher123');
  console.log('Student: student1@codetracker.com / student123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
