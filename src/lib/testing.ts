import { PrismaClient } from '@prisma/client';
import { config } from './config';

// Test database client
export const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: config.database.url + '_test',
    },
  },
});

// Test utilities
export class TestUtils {
  // Create test user
  static async createTestUser(overrides: any = {}) {
    return await testPrisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        role: 'STUDENT',
        ...overrides,
      },
    });
  }

  // Create test assignment
  static async createTestAssignment(teacherId: string, overrides: any = {}) {
    return await testPrisma.assignment.create({
      data: {
        title: 'Test Assignment',
        description: 'Test assignment description',
        teacherId,
        language: 'javascript',
        difficulty: 'EASY',
        points: 100,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: 'ACTIVE',
        ...overrides,
      },
    });
  }

  // Create test submission
  static async createTestSubmission(userId: string, assignmentId: string, overrides: any = {}) {
    return await testPrisma.assignmentSubmission.create({
      data: {
        userId,
        assignmentId,
        code: 'console.log("Hello, World!");',
        language: 'javascript',
        status: 'SUBMITTED',
        submittedAt: new Date(),
        ...overrides,
      },
    });
  }

  // Create test collaboration session
  static async createTestCollaborationSession(ownerId: string, overrides: any = {}) {
    return await testPrisma.collaborationSession.create({
      data: {
        title: 'Test Session',
        description: 'Test collaboration session',
        ownerId,
        type: 'PAIR_PROGRAMMING',
        status: 'ACTIVE',
        visibility: 'PRIVATE',
        inviteCode: `test-${Date.now()}`,
        ...overrides,
      },
    });
  }

  // Create test forum post
  static async createTestForumPost(authorId: string, overrides: any = {}) {
    return await testPrisma.forumPost.create({
      data: {
        title: 'Test Post',
        content: 'Test post content',
        authorId,
        category: 'GENERAL',
        ...overrides,
      },
    });
  }

  // Clean up test data
  static async cleanup() {
    await testPrisma.activityLog.deleteMany();
    await testPrisma.notification.deleteMany();
    await testPrisma.forumComment.deleteMany();
    await testPrisma.forumPost.deleteMany();
    await testPrisma.collaborationParticipant.deleteMany();
    await testPrisma.collaborationSession.deleteMany();
    await testPrisma.codeReview.deleteMany();
    await testPrisma.assignmentSubmission.deleteMany();
    await testPrisma.assignment.deleteMany();
    await testPrisma.user.deleteMany();
  }

  // Generate test data
  static async generateTestData() {
    // Create test users
    const teacher = await this.createTestUser({ role: 'TEACHER' });
    const student1 = await this.createTestUser({ role: 'STUDENT' });
    const student2 = await this.createTestUser({ role: 'STUDENT' });

    // Create test assignments
    const assignment1 = await this.createTestAssignment(teacher.id);
    const assignment2 = await this.createTestAssignment(teacher.id, {
      title: 'Advanced Assignment',
      difficulty: 'HARD',
    });

    // Create test submissions
    await this.createTestSubmission(student1.id, assignment1.id);
    await this.createTestSubmission(student2.id, assignment1.id);

    // Create test collaboration session
    await this.createTestCollaborationSession(teacher.id);

    // Create test forum post
    await this.createTestForumPost(teacher.id);

    return {
      teacher,
      student1,
      student2,
      assignment1,
      assignment2,
    };
  }
}

// Mock data generators
export class MockDataGenerator {
  // Generate random string
  static randomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Generate random email
  static randomEmail(): string {
    return `test-${this.randomString(8)}@example.com`;
  }

  // Generate random user data
  static randomUserData() {
    return {
      email: this.randomEmail(),
      name: `Test User ${this.randomString(5)}`,
      role: ['STUDENT', 'TEACHER', 'ADMIN'][Math.floor(Math.random() * 3)] as any,
    };
  }

  // Generate random assignment data
  static randomAssignmentData(teacherId: string) {
    const languages = ['javascript', 'python', 'java', 'cpp', 'typescript'];
    const difficulties = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];
    
    return {
      title: `Test Assignment ${this.randomString(5)}`,
      description: `Test assignment description ${this.randomString(20)}`,
      teacherId,
      language: languages[Math.floor(Math.random() * languages.length)],
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)] as any,
      points: Math.floor(Math.random() * 100) + 50,
      dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within 30 days
      status: 'ACTIVE',
    };
  }

  // Generate random submission data
  static randomSubmissionData(userId: string, assignmentId: string) {
    const codeSnippets = [
      'console.log("Hello, World!");',
      'def hello_world():\n    print("Hello, World!")',
      'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
      '#include <iostream>\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
    ];

    return {
      userId,
      assignmentId,
      code: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
      language: ['javascript', 'python', 'java', 'cpp'][Math.floor(Math.random() * 4)],
      status: 'SUBMITTED',
      submittedAt: new Date(),
    };
  }

  // Generate random forum post data
  static randomForumPostData(authorId: string) {
    const categories = ['GENERAL', 'HELP', 'DISCUSSION', 'ANNOUNCEMENT'];
    
    return {
      title: `Test Post ${this.randomString(5)}`,
      content: `Test post content ${this.randomString(50)}`,
      authorId,
      category: categories[Math.floor(Math.random() * categories.length)] as any,
    };
  }

  // Generate random collaboration session data
  static randomCollaborationSessionData(ownerId: string) {
    const types = ['PAIR_PROGRAMMING', 'GROUP_PROJECT', 'CODE_REVIEW'];
    const visibilities = ['PRIVATE', 'PUBLIC'];
    
    return {
      title: `Test Session ${this.randomString(5)}`,
      description: `Test session description ${this.randomString(30)}`,
      ownerId,
      type: types[Math.floor(Math.random() * types.length)] as any,
      status: 'ACTIVE',
      visibility: visibilities[Math.floor(Math.random() * visibilities.length)] as any,
      inviteCode: `test-${this.randomString(10)}`,
    };
  }
}

// Test assertions
export class TestAssertions {
  // Assert user has required fields
  static assertUser(user: any) {
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('role');
    expect(user).toHaveProperty('createdAt');
    expect(user).toHaveProperty('updatedAt');
  }

  // Assert assignment has required fields
  static assertAssignment(assignment: any) {
    expect(assignment).toHaveProperty('id');
    expect(assignment).toHaveProperty('title');
    expect(assignment).toHaveProperty('description');
    expect(assignment).toHaveProperty('teacherId');
    expect(assignment).toHaveProperty('language');
    expect(assignment).toHaveProperty('difficulty');
    expect(assignment).toHaveProperty('points');
    expect(assignment).toHaveProperty('dueDate');
    expect(assignment).toHaveProperty('status');
    expect(assignment).toHaveProperty('createdAt');
    expect(assignment).toHaveProperty('updatedAt');
  }

  // Assert submission has required fields
  static assertSubmission(submission: any) {
    expect(submission).toHaveProperty('id');
    expect(submission).toHaveProperty('userId');
    expect(submission).toHaveProperty('assignmentId');
    expect(submission).toHaveProperty('code');
    expect(submission).toHaveProperty('language');
    expect(submission).toHaveProperty('status');
    expect(submission).toHaveProperty('submittedAt');
    expect(submission).toHaveProperty('createdAt');
    expect(submission).toHaveProperty('updatedAt');
  }

  // Assert collaboration session has required fields
  static assertCollaborationSession(session: any) {
    expect(session).toHaveProperty('id');
    expect(session).toHaveProperty('title');
    expect(session).toHaveProperty('description');
    expect(session).toHaveProperty('ownerId');
    expect(session).toHaveProperty('type');
    expect(session).toHaveProperty('status');
    expect(session).toHaveProperty('visibility');
    expect(session).toHaveProperty('inviteCode');
    expect(session).toHaveProperty('createdAt');
    expect(session).toHaveProperty('updatedAt');
  }

  // Assert forum post has required fields
  static assertForumPost(post: any) {
    expect(post).toHaveProperty('id');
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('content');
    expect(post).toHaveProperty('authorId');
    expect(post).toHaveProperty('category');
    expect(post).toHaveProperty('createdAt');
    expect(post).toHaveProperty('updatedAt');
  }

  // Assert API response structure
  static assertApiResponse(response: any, expectedStatus: number = 200) {
    expect(response.status).toBe(expectedStatus);
    expect(response.data).toBeDefined();
  }

  // Assert error response structure
  static assertErrorResponse(response: any, expectedStatus: number) {
    expect(response.status).toBe(expectedStatus);
    expect(response.data).toHaveProperty('error');
    expect(response.data.error).toHaveProperty('code');
    expect(response.data.error).toHaveProperty('message');
  }

  // Assert pagination structure
  static assertPagination(data: any) {
    expect(data).toHaveProperty('items');
    expect(data).toHaveProperty('pagination');
    expect(data.pagination).toHaveProperty('page');
    expect(data.pagination).toHaveProperty('limit');
    expect(data.pagination).toHaveProperty('total');
    expect(data.pagination).toHaveProperty('totalPages');
  }
}

// Test environment setup
export class TestEnvironment {
  // Setup test environment
  static async setup() {
    // Set test environment variables
    process.env.NODE_ENV = 'test';
    process.env.DATABASE_URL = config.database.url + '_test';
    
    // Connect to test database
    await testPrisma.$connect();
    
    // Clean up any existing test data
    await TestUtils.cleanup();
  }

  // Teardown test environment
  static async teardown() {
    // Clean up test data
    await TestUtils.cleanup();
    
    // Disconnect from test database
    await testPrisma.$disconnect();
  }

  // Reset test database
  static async reset() {
    await TestUtils.cleanup();
  }
}

// Performance testing utilities
export class PerformanceTestUtils {
  // Measure execution time
  static async measureTime<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
    const start = Date.now();
    const result = await fn();
    const duration = Date.now() - start;
    return { result, duration };
  }

  // Benchmark function execution
  static async benchmark<T>(
    fn: () => Promise<T>,
    iterations: number = 100
  ): Promise<{ results: T[]; avgDuration: number; minDuration: number; maxDuration: number }> {
    const results: T[] = [];
    const durations: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const { result, duration } = await this.measureTime(fn);
      results.push(result);
      durations.push(duration);
    }

    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);

    return {
      results,
      avgDuration,
      minDuration,
      maxDuration,
    };
  }

  // Load test database operations
  static async loadTestDatabaseOperations(operations: number = 1000) {
    const { duration } = await this.measureTime(async () => {
      const promises = [];
      
      for (let i = 0; i < operations; i++) {
        promises.push(TestUtils.createTestUser());
      }
      
      await Promise.all(promises);
    });

    return {
      operations,
      duration,
      operationsPerSecond: Math.round(operations / (duration / 1000)),
    };
  }
}

// Integration test utilities
export class IntegrationTestUtils {
  // Test API endpoint
  static async testApiEndpoint(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    data?: any,
    headers?: any
  ) {
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      fetchOptions.body = JSON.stringify(data);
    }

    const response = await fetch(url, fetchOptions);
    const responseData = await response.json();

    return {
      status: response.status,
      data: responseData,
      headers: response.headers,
    };
  }

  // Test authenticated API endpoint
  static async testAuthenticatedApiEndpoint(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    token: string,
    data?: any
  ) {
    return this.testApiEndpoint(method, url, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  // Test API with different user roles
  static async testApiWithRoles(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    tokens: { [role: string]: string },
    data?: any
  ) {
    const results: { [role: string]: any } = {};

    for (const [role, token] of Object.entries(tokens)) {
      results[role] = await this.testAuthenticatedApiEndpoint(method, url, token, data);
    }

    return results;
  }
}

export default {
  testPrisma,
  TestUtils,
  MockDataGenerator,
  TestAssertions,
  TestEnvironment,
  PerformanceTestUtils,
  IntegrationTestUtils,
};
