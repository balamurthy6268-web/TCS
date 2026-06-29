import { test, expect } from '@playwright/test';

test('test1 @titletest', async ({ page }) => {
  await page.goto('https://www.google.com/');
  await page.getByRole('combobox', { name: 'Search' }).click();
  await page.getByRole('combobox', { name: 'Search1' }).fill('fifa');

  await page.goto('https://www.google.com/');

   await expect(page).toHaveTitle(/Google/);
});
test('test2', async ({ page }) => {
  await page.goto('https://www.google.com/');
  await page.getByRole('combobox', { name: 'Search' }).click();
  await page.getByRole('combobox', { name: 'Search' }).fill('fifa');

  await page.goto('https://www.google.com/');

   await expect(page).toHaveTitle(/Google/);
});