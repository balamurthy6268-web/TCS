import { test, expect } from '@playwright/test';

//move away from global setup and use setup project as per recommendation.
//There is no need for test.use storagestate if we use setup project

test('authenticate', async ({ page }) => {

    console.log('>>> AUTH SETUP START');

    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
   
    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('admin123');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/dashboard/);

    await page.context().storageState({
        path: 'storage/.auth/orangehrm-auth.json'
    });
console.log('>>> AUTH SETUP END');

});