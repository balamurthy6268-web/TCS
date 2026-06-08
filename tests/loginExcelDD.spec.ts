import { test, expect, chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { readExcel } from './utils/excelutils';

const testData = readExcel('data/testdata.xlsx', 'Sheet1');

for (const data of testData as any[]) {
  test(`Login test for ${data.username}` + `-${data.password}`, async () => {
    // Launch Browser
    const browser: Browser = await chromium.launch({
      headless: false
    });

    // Create Browser Context
    const context: BrowserContext = await browser.newContext();

    // Create New Page
    const page: Page = await context.newPage();

    // Navigate
    await page.goto('https://opensource-demo.orangehrmlive.com/');
    // Use explicit selectors for username and password inputs to avoid role/label mismatches
    await page.fill('input[name="username"]', data.username);
    await page.fill('input[name="password"]', data.password);
    await page.locator('.orangehrm-login-button').click();
    try {
      await expect(page).toHaveURL(/.*dashboard.*/);

      console.log(`Login successful for ${data.username} with password ${data.password}`);
      // await page.getByRole('listitem').filter({ hasText: 'Madge van der Meij' }).locator('i').click();
      await page.getByRole('listitem').locator('i').click();
      await page.getByRole('menuitem', { name: 'Logout' }).click();
    } catch (error) {
      console.error(`Login failed for ${data.username} with password ${data.password}`);
    await page.screenshot({
    path: 'screenshots/fullpage.png',
    fullPage: true
});
    } finally {
      // Ensure browser is closed after each test
      await browser.close();
    }


  });
}