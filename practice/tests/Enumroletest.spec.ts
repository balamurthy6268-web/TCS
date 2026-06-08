import { test, expect } from '@playwright/test';

enum UserRole {
  Admin = 'Admin',
  Manager = 'Manager',
  User = 'User'
}

test('validate greeting', async ({ page }) => {

  await page.goto('file:///E:/blaptop/tcs/loginrole.html');

  await page.selectOption('#role', UserRole.Manager);

  await page.click('button');

  await expect(page.locator('#greeting'))
      .toHaveText('Welcome Manager');
});