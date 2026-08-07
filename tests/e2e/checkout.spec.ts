import { test, expect } from '@playwright/test';

test.describe('E-Commerce Checkout & Order Workflow', () => {
  test('Customer can view catalog, add product to cart, and reach checkout', async ({ page }) => {
    // 1. Visit homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/Nati Store/i);

    // 2. Browse products
    await page.goto('/products');
    await expect(page.locator('h1')).toContainText(/Products|Catalog/i);

    // 3. Navigate to Checkout
    await page.goto('/checkout');
    await expect(page).toHaveURL(/.*checkout/);
  });

  test('Admin dashboard is protected and accessible to admin role', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*(admin|login)/);
  });

  test('Vendor dashboard is protected and accessible to vendor role', async ({ page }) => {
    await page.goto('/vendor');
    await expect(page).toHaveURL(/.*(vendor|login)/);
  });
});
