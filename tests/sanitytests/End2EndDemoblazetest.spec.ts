import { test, expect } from '@playwright/test';
import { items } from '../../data/items.json';

test.describe(
  'E2E – Login (storageState) → Add items → View cart',
  () => {

    // ✅ Apply storage state ONCE
    test.use({ storageState: 'storage/demoblaze-auth.json' });

    test('User should already be logged in', async ({ page }) => {
      //await page.goto(process.env.BASE_URL!);
      await page.goto('https://www.demoblaze.com/');

      // Reliable login validation
      await expect(page.locator('#logout2')).toBeVisible();
      await expect(page.getByText('Welcome')).toBeVisible();
    });

    // ✅ Data-driven add-to-cart
    for (const [index, item] of items.entries()) {
      test(`Add Item: ${item.name} (Iteration ${index + 1})`, async ({ page }) => {
        await page.goto('https://www.demoblaze.com/');

        // Navigate to product
        await page.getByRole('link', { name: item.name }).click();

        // Handle alert once
        page.once('dialog', dialog => dialog.accept());

        await page.getByRole('link', { name: 'Add to cart' }).click();
      });
    }

    test('View Cart and validate items', async ({ page }) => {
      await page.goto('https://www.demoblaze.com/');

      await page.getByRole('link', { name: 'Cart' }).click();

      // Validate cart page loaded
      await expect(page.locator('#tbodyid')).toBeVisible();
    });

  }
);
