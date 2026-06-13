import { test, expect, Page, Locator } from '@playwright/test';

let page: Page;
test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto('file:///e:/blaptop/tcs/strings.html');
});

test.afterAll(async () => {
  await page.close();
});

test.describe('DemoQA UI Automation', () => {
  test('Text Box Interaction', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');

    const fullnametext: Locator = page.getByRole('textbox', { name: 'Full Name' });
    await fullnametext.click();
    await fullnametext.fill('Bala Murthy');

    await expect(fullnametext).toHaveValue('Bala Murthy');
  });

  test('Submit Button Visibility', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await expect(page.locator('#submit')).toBeVisible();
    await expect(page.locator('xpath=//button[@id="submit"]')).toBeVisible();
    await expect(page.getByText('Submit')).toBeVisible();
  });
});
