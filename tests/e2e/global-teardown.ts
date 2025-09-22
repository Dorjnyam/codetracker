import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Cleaning up E2E test environment...');

  // Clean up any test data or resources
  // This could include:
  // - Cleaning up test databases
  // - Removing test files
  // - Closing connections
  // - etc.

  console.log('✅ E2E test environment cleanup completed');
}

export default globalTeardown;
