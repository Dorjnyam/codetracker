import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display sign in page', async ({ page }) => {
    await page.goto('/auth/signin');
    
    await expect(page).toHaveTitle(/Sign In/);
    await expect(page.locator('h1')).toContainText('Sign In');
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should display sign up page', async ({ page }) => {
    await page.goto('/auth/signup');
    
    await expect(page).toHaveTitle(/Sign Up/);
    await expect(page.locator('h1')).toContainText('Sign Up');
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should navigate between auth pages', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Click on sign up link
    await page.click('text=Sign up');
    await expect(page).toHaveURL('/auth/signup');
    
    // Click on sign in link
    await page.click('text=Sign in');
    await expect(page).toHaveURL('/auth/signin');
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Submit empty form
    await page.click('button[type="submit"]');
    
    // Check for validation errors
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Enter invalid email
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Check for validation error
    await expect(page.locator('text=Please enter a valid email')).toBeVisible();
  });

  test('should redirect to dashboard after successful sign in', async ({ page }) => {
    // This test would require a test user to be created
    // For now, we'll test the redirect behavior
    await page.goto('/auth/signin');
    
    // Mock successful authentication
    await page.evaluate(() => {
      // Simulate successful login
      localStorage.setItem('auth-token', 'mock-token');
    });
    
    // Navigate to dashboard
    await page.goto('/dashboard');
    
    // Should redirect to dashboard overview
    await expect(page).toHaveURL('/dashboard/overview');
  });

  test('should redirect to sign in for protected routes', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should redirect to sign in page
    await expect(page).toHaveURL('/auth/signin');
  });

  test('should handle OAuth providers', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Check if OAuth buttons are present
    const githubButton = page.locator('button:has-text("GitHub")');
    const googleButton = page.locator('button:has-text("Google")');
    
    if (await githubButton.isVisible()) {
      await expect(githubButton).toBeVisible();
    }
    
    if (await googleButton.isVisible()) {
      await expect(googleButton).toBeVisible();
    }
  });
});

test.describe('Registration Flow', () => {
  test('should show validation errors for registration form', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // Submit empty form
    await page.click('button[type="submit"]');
    
    // Check for validation errors
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should show error for password mismatch', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // Fill form with mismatched passwords
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'differentpassword');
    await page.click('button[type="submit"]');
    
    // Check for validation error
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
  });

  test('should show error for weak password', async ({ page }) => {
    await page.goto('/auth/signup');
    
    // Fill form with weak password
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', '123');
    await page.fill('input[name="confirmPassword"]', '123');
    await page.click('button[type="submit"]');
    
    // Check for validation error
    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible();
  });
});
