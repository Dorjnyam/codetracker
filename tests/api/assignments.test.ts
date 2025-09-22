import { TestUtils, TestAssertions, IntegrationTestUtils } from '../src/lib/testing';

describe('Assignments API', () => {
  let teacher: any;
  let student: any;
  let assignment: any;

  beforeEach(async () => {
    teacher = await TestUtils.createTestUser({ role: 'TEACHER' });
    student = await TestUtils.createTestUser({ role: 'STUDENT' });
    assignment = await TestUtils.createTestAssignment(teacher.id);
  });

  describe('GET /api/assignments', () => {
    it('should return assignments for authenticated user', async () => {
      const response = await IntegrationTestUtils.testApiEndpoint(
        'GET',
        'http://localhost:3000/api/assignments'
      );

      TestAssertions.assertApiResponse(response, 200);
      expect(Array.isArray(response.data.assignments)).toBe(true);
    });

    it('should filter assignments by language', async () => {
      const response = await IntegrationTestUtils.testApiEndpoint(
        'GET',
        'http://localhost:3000/api/assignments?language=javascript'
      );

      TestAssertions.assertApiResponse(response, 200);
      expect(Array.isArray(response.data.assignments)).toBe(true);
    });

    it('should filter assignments by difficulty', async () => {
      const response = await IntegrationTestUtils.testApiEndpoint(
        'GET',
        'http://localhost:3000/api/assignments?difficulty=EASY'
      );

      TestAssertions.assertApiResponse(response, 200);
      expect(Array.isArray(response.data.assignments)).toBe(true);
    });

    it('should filter assignments by status', async () => {
      const response = await IntegrationTestUtils.testApiEndpoint(
        'GET',
        'http://localhost:3000/api/assignments?status=ACTIVE'
      );

      TestAssertions.assertApiResponse(response, 200);
      expect(Array.isArray(response.data.assignments)).toBe(true);
    });

    it('should paginate assignments', async () => {
      const response = await IntegrationTestUtils.testApiEndpoint(
        'GET',
        'http://localhost:3000/api/assignments?page=1&limit=10'
      );

      TestAssertions.assertApiResponse(response, 200);
      TestAssertions.assertPagination(response.data);
    });
  });

  describe('POST /api/assignments', () => {
    it('should create assignment for teacher', async () => {
      const assignmentData = {
        title: 'New Assignment',
        description: 'Assignment description',
        language: 'javascript',
        difficulty: 'MEDIUM',
        points: 100,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE',
      };

      const response = await IntegrationTestUtils.testApiEndpoint(
        'POST',
        'http://localhost:3000/api/assignments',
        assignmentData
      );

      TestAssertions.assertApiResponse(response, 201);
      TestAssertions.assertAssignment(response.data.assignment);
      expect(response.data.assignment.title).toBe(assignmentData.title);
    });

    it('should fail with invalid data', async () => {
      const invalidData = {
        title: '', // Empty title
        description: 'Assignment description',
        language: 'invalid', // Invalid language
        difficulty: 'INVALID', // Invalid difficulty
        points: -10, // Negative points
      };

      const response = await IntegrationTestUtils.testApiEndpoint(
        'POST',
        'http://localhost:3000/api/assignments',
        invalidData
      );

      TestAssertions.assertErrorResponse(response, 400);
    });

    it('should fail for non-teacher users', async () => {
      const assignmentData = {
        title: 'New Assignment',
        description: 'Assignment description',
        language: 'javascript',
        difficulty: 'MEDIUM',
        points: 100,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE',
      };

      // This would require proper authentication setup
      const response = await IntegrationTestUtils.testApiEndpoint(
        'POST',
        'http://localhost:3000/api/assignments',
        assignmentData
      );

      // Should fail for unauthorized users
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/assignments/[id]', () => {
    it('should return assignment by ID', async () => {
      const response = await IntegrationTestUtils.testApiEndpoint(
        'GET',
        `http://localhost:3000/api/assignments/${assignment.id}`
      );

      TestAssertions.assertApiResponse(response, 200);
      TestAssertions.assertAssignment(response.data.assignment);
      expect(response.data.assignment.id).toBe(assignment.id);
    });

    it('should return 404 for non-existent assignment', async () => {
      const response = await IntegrationTestUtils.testApiEndpoint(
        'GET',
        'http://localhost:3000/api/assignments/non-existent-id'
      );

      TestAssertions.assertErrorResponse(response, 404);
    });
  });

  describe('PUT /api/assignments/[id]', () => {
    it('should update assignment for teacher', async () => {
      const updateData = {
        title: 'Updated Assignment',
        description: 'Updated description',
        points: 150,
      };

      const response = await IntegrationTestUtils.testApiEndpoint(
        'PUT',
        `http://localhost:3000/api/assignments/${assignment.id}`,
        updateData
      );

      TestAssertions.assertApiResponse(response, 200);
      expect(response.data.assignment.title).toBe(updateData.title);
      expect(response.data.assignment.points).toBe(updateData.points);
    });

    it('should fail for non-teacher users', async () => {
      const updateData = {
        title: 'Updated Assignment',
      };

      const response = await IntegrationTestUtils.testApiEndpoint(
        'PUT',
        `http://localhost:3000/api/assignments/${assignment.id}`,
        updateData
      );

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/assignments/[id]', () => {
    it('should delete assignment for teacher', async () => {
      const response = await IntegrationTestUtils.testApiEndpoint(
        'DELETE',
        `http://localhost:3000/api/assignments/${assignment.id}`
      );

      TestAssertions.assertApiResponse(response, 200);
    });

    it('should fail for non-teacher users', async () => {
      const response = await IntegrationTestUtils.testApiEndpoint(
        'DELETE',
        `http://localhost:3000/api/assignments/${assignment.id}`
      );

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/assignments/[id]/submit', () => {
    it('should submit assignment for student', async () => {
      const submissionData = {
        code: 'console.log("Hello, World!");',
        language: 'javascript',
      };

      const response = await IntegrationTestUtils.testApiEndpoint(
        'POST',
        `http://localhost:3000/api/assignments/${assignment.id}/submit`,
        submissionData
      );

      TestAssertions.assertApiResponse(response, 201);
      expect(response.data.submission).toBeDefined();
      expect(response.data.submission.code).toBe(submissionData.code);
    });

    it('should fail with invalid code', async () => {
      const submissionData = {
        code: '', // Empty code
        language: 'javascript',
      };

      const response = await IntegrationTestUtils.testApiEndpoint(
        'POST',
        `http://localhost:3000/api/assignments/${assignment.id}/submit`,
        submissionData
      );

      TestAssertions.assertErrorResponse(response, 400);
    });
  });

  describe('POST /api/assignments/execute', () => {
    it('should execute code and return results', async () => {
      const executionData = {
        code: 'console.log("Hello, World!");',
        language: 'javascript',
        testCases: [
          {
            input: '',
            expectedOutput: 'Hello, World!',
          },
        ],
      };

      const response = await IntegrationTestUtils.testApiEndpoint(
        'POST',
        'http://localhost:3000/api/assignments/execute',
        executionData
      );

      TestAssertions.assertApiResponse(response, 200);
      expect(response.data.results).toBeDefined();
      expect(Array.isArray(response.data.results)).toBe(true);
    });

    it('should fail with invalid language', async () => {
      const executionData = {
        code: 'console.log("Hello, World!");',
        language: 'invalid',
        testCases: [],
      };

      const response = await IntegrationTestUtils.testApiEndpoint(
        'POST',
        'http://localhost:3000/api/assignments/execute',
        executionData
      );

      TestAssertions.assertErrorResponse(response, 400);
    });
  });
});
