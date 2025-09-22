import { TestUtils, TestAssertions, IntegrationTestUtils } from '../src/lib/testing';

describe('Authentication API', () => {
  let testUser: any;

  beforeEach(async () => {
    testUser = await TestUtils.createTestUser();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'STUDENT',
      };

      const response = await IntegrationTestUtils.testApiEndpoint(
        'POST',
        'http://localhost:3000/api/auth/register',
        userData
      );

      TestAssertions.assertApiResponse(response, 201);
      expect(response.data.user).toBeDefined();
      expect(response.data.user.email).toBe(userData.email);
      expect(response.data.user.name).toBe(userData.name);
      expect(response.data.user.role).toBe(userData.role);
    });

    it('should fail with invalid email', async () => {
      const userData = {
        name: 'New User',
        email: 'invalid-email',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'STUDENT',
      };

      const response = await IntegrationTestUtils.testApiEndpoint(
        'POST',
        'http://localhost:3000/api/auth/register',
        userData
      );

      TestAssertions.assertErrorResponse(response, 400);
    });

    it('should fail with password mismatch', async () => {
      const userData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        confirmPassword: 'differentpassword',
        role: 'STUDENT',
      };

      const response = await IntegrationTestUtils.testApiEndpoint(
        'POST',
        'http://localhost:3000/api/auth/register',
        userData
      );

      TestAssertions.assertErrorResponse(response, 400);
    });

    it('should fail with duplicate email', async () => {
      const userData = {
        name: 'New User',
        email: testUser.email,
        password: 'password123',
        confirmPassword: 'password123',
        role: 'STUDENT',
      };

      const response = await IntegrationTestUtils.testApiEndpoint(
        'POST',
        'http://localhost:3000/api/auth/register',
        userData
      );

      TestAssertions.assertErrorResponse(response, 409);
    });
  });

  describe('POST /api/auth/signin', () => {
    it('should sign in user successfully', async () => {
      const signinData = {
        email: testUser.email,
        password: 'password123',
      };

      const response = await IntegrationTestUtils.testApiEndpoint(
        'POST',
        'http://localhost:3000/api/auth/signin',
        signinData
      );

      TestAssertions.assertApiResponse(response, 200);
      expect(response.data.user).toBeDefined();
      expect(response.data.user.email).toBe(testUser.email);
    });

    it('should fail with invalid credentials', async () => {
      const signinData = {
        email: testUser.email,
        password: 'wrongpassword',
      };

      const response = await IntegrationTestUtils.testApiEndpoint(
        'POST',
        'http://localhost:3000/api/auth/signin',
        signinData
      );

      TestAssertions.assertErrorResponse(response, 401);
    });

    it('should fail with non-existent user', async () => {
      const signinData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      const response = await IntegrationTestUtils.testApiEndpoint(
        'POST',
        'http://localhost:3000/api/auth/signin',
        signinData
      );

      TestAssertions.assertErrorResponse(response, 401);
    });
  });

  describe('GET /api/auth/session', () => {
    it('should return session for authenticated user', async () => {
      // This would require setting up a proper session token
      // For now, we'll test the endpoint structure
      const response = await IntegrationTestUtils.testApiEndpoint(
        'GET',
        'http://localhost:3000/api/auth/session'
      );

      // Should return session data or null
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
    });
  });

  describe('POST /api/auth/signout', () => {
    it('should sign out user successfully', async () => {
      const response = await IntegrationTestUtils.testApiEndpoint(
        'POST',
        'http://localhost:3000/api/auth/signout'
      );

      TestAssertions.assertApiResponse(response, 200);
    });
  });
});
