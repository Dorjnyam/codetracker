import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Setting up E2E test environment...');

  // Start browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Wait for the application to be ready
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Check if the application is running
    const title = await page.title();
    if (!title || title.includes('Error')) {
      throw new Error('Application is not running properly');
    }

    console.log('✅ Application is ready for testing');
  } catch (error) {
    console.error('❌ Failed to setup E2E test environment:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
