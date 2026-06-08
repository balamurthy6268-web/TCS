
//create a playwright test to check if login to orangehrmlive website is successful.

import { test, expect } from '@playwright/test';

test('Login to OrangeHRM Live', async ({ page }) => {
await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
await page.getByRole('textbox', { name: 'username' }).click();
await page.getByRole('textbox', { name: 'username' }).fill('Admin');
await page.getByRole('textbox', { name: 'username' }).press('Tab');
await page.getByRole('textbox', { name: 'password' }).fill('admin5678');

await page.getByRole('button', { name: 'Login' }).click();

try {
  
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    console.log("Login is successful!");
    await page.getByRole('menuitem', { name: 'Logout' }).click();

} catch (error) {
  console.error('Login failed or Dashboard not found');
}

});
