import { TestEnvironment } from '../src/lib/testing';

// Global test setup
beforeAll(async () => {
  await TestEnvironment.setup();
});

// Global test teardown
afterAll(async () => {
  await TestEnvironment.teardown();
});

// Clean up after each test
afterEach(async () => {
  await TestEnvironment.reset();
});
