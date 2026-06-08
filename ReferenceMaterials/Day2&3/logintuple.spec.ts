import { test, expect } from '@playwright/test';

type LoginData = [string, string, string];

//tuple to store username, password and expected result of login test

const loginUsers: LoginData[] = [
  ['Admin', 'admin123', 'Success'],
  ['invalid', 'wrong123', 'Failure'],
  ['user1', 'user123', 'Failure'],
];

loginUsers.forEach(([username, password, expectedResult]) => {
test(`Login test for ${username}`, async ({ page }) => {

    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    await page.getByRole('textbox', { name: 'Username' }).fill(username);
await page.getByRole('textbox', { name: 'Username' }).press('Tab');
await page.getByRole('textbox', { name: 'Password' }).fill(password);

await page.getByRole('button', { name: 'Login' }).click();

    //if (expectedResult === 'Success') {
    try {
      await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
      console.log('Login is successful!');
      await page.getByRole('menuitem', { name: 'Logout' }).click();
    } catch (error) {
      await expect(page.locator('text=Invalid credentials')).toBeVisible();
    }
  

});
});
  